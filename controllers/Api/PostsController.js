const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");
const { sendEmail } = require("../../utils/mail");
const path = require("path");
exports.search = async (req, res, next) => {
  console.log({ limit: req.body.limit });
  try {
    const { col: searchCol, page, limit, search, type_id } = req.body;
    const offset = (page - 1) * limit;

    // Build the where clause
    const where = {
      [searchCol]: {
        [Op.like]: `%${search}%`,
      },
    };

    // Add type filter if provided
    if (type_id) {
      where.type_id = type_id; // Exact match for 'news' or 'gallery'
    }

    // Fetch paginated results
    const assets = await conn.posts.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: ["type"],
      where,
    });

    // Get total count for pagination
    const count = await conn.posts.count({ where });

    // Send response
    res.status(200).json({
      status: true,
      data: assets,
      tot: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to search posts",
      error: error.message,
    });
  }
};

exports.searchByType = async (req, res, next) => {
  console.log({ limit: req.body.limit });
  try {
    const { col: searchCol, page, limit, search, type } = req.body;
    const offset = (page - 1) * limit;
    const post_type = await conn.post_types.findOne({
      where: {
        code: req.body.type,
      },
    });

    console.log(req.body, post_type.id);

    const type_id = post_type.id;
    // Build the where clause
    const where = {
      [searchCol]: {
        [Op.like]: `%${search}%`,
      },
    };

    // Add type filter if provided
    if (type_id) {
      where.type_id = type_id; // Exact match for 'news' or 'gallery'
    }

    // Fetch paginated results
    const assets = await conn.posts.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: ["type"],
      where,
    });

    // Get total count for pagination
    const count = await conn.posts.count({ where });

    // Send response
    res.status(200).json({
      status: true,
      data: assets,
      tot: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to search posts",
      error: error.message,
    });
  }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getPosts = async (req, res, next) => {
  try {
    const result = await conn.posts.findAll();
    res.status(200).json({ status: true, data: result });
    // res.status(500).json({
    //   status: false,
    //   msg: `حدث خطأ ما في السيرفر`,
    // });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};

exports.createPosts = async (req, res, next) => {
  try {
    const {
      type_id,
      title_ar,
      title_en,
      content_ar,
      content_en,
      slug,
      is_featured,
      is_active,
      sort_orders,
      image_url,
    } = req.body;

    console.log({ body_images: req.body.images });

    // Validation
    const type = await conn.post_types.findOne({
      where: {
        id: type_id,
      },
    });
    if (!title_ar || !title_en) {
      return res
        .status(400)
        .json({ status: false, msg: "العنوان بالعربية والإنجليزية مطلوب" });
    }
    if (type.code === "gallery" && !req.body.images) {
      return res
        .status(400)
        .json({ status: false, msg: "يجب تحميل صورة واحدة على الأقل للمعرض" });
    }

    // Generate slug if not provided
    const generatedSlug = slug;

    // Check slug uniqueness
    const existingPost = await conn.posts.findOne({
      where: { slug: generatedSlug },
    });
    if (existingPost) {
      return res.status(400).json({
        status: false,
        msg: "المعرف (slug) موجود بالفعل، اختر معرفًا آخر",
      });
    }

    // Prepare post data
    const postData = {
      type_id,
      slug: generatedSlug,
      title_ar,
      title_en,
      video_url,
      content_ar: content_ar || null,
      content_en: content_en || null,
      image_url,
      is_featured: is_featured === "1" || is_featured === true,
      is_active: is_active === "1" || is_active === true,
    };

    // Create post
    const post = await conn.posts.create(postData);

    // // Handle gallery images if type.code is gallery
    let images = req?.body?.images || [];
    let galleryImages = [];
    if (type.code === "gallery" && req.body.images) {
      galleryImages = images.map((file, index) => ({
        post_id: post.id,
        image_url: file,
        sort_order:
          sort_orders && sort_orders[index]
            ? parseInt(sort_orders[index])
            : index,
      }));

      await conn.post_images.bulkCreate(galleryImages);
    }

    // Prepare response data
    const responseData = {
      post,
      galleryImages: type.code === "gallery" ? galleryImages : [],
    };

    res.status(200).json({
      status: true,
      data: responseData,
      msg: "تم إنشاء المنشور بنجاح",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, msg: "حدث خطأ ما في السيرفر" });
  }
};

exports.paginate = async (req, res, next) => {
  try {
    const offset = (req.body.page - 1) * req.body.limit;
    console.log("the offset", offset, "the limit is ", req.body.limit);
    const result = await conn.posts.findAll({
      order: [["id", "DESC"]],
      offset: offset,
      include: ["type"],

      limit: req.body.limit,
      subQuery: true,
    });
    const count = await conn.posts.findAll();
    res.status(200).json({ status: true, data: result, tot: count.length });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};
//@decs   Get All
//@route  GET
//@access Public
exports.getPostsById = async (req, res, next) => {
  try {
    const result = await conn.posts.findOne({
      where: { id: req.params.id },
      include: ["post_images", "type"],
    });
    res.status(200).json({ status: true, data: result });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};

//@decs   Get All
//@route  Put
//@access Public
// exports.updatePosts = async (req, res, next) => {
//   try {
//     const category = await conn.posts.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (req.body.image) {
//       if (category?.image) {
//         fs.unlink(category.image, (err) => {
//           if (err) console.log(err);
//           else {
//             console.log("\nDeleted file successfuly");

//             // Get the files in current directory
//             // after deletion
//           }
//         });
//       }
//     }
//     await conn.posts.update(req.body, {
//       where: { id: req.params.id },
//     });
//     res.status(200).json({ status: true, data: req.body });
//   } catch (e) {
//     console.log(e);

//     res.status(500).json({
//       status: false,
//       msg: `حدث خطأ ما في السيرفر`,
//     });
//   }
// };

exports.updatePosts = async (req, res, next) => {
  try {
    const {
      type_id,
      title_ar,
      title_en,
      content_ar,
      content_en,
      slug,
      is_featured,
      is_active,
      sort_orders,
      image_url,
      video_url,
      image_ids,
    } = req.body;

    const postId = req.params.id;

    // Validation
    const type = await conn.post_types.findOne({
      where: { id: type_id },
    });
    if (!type) {
      return res
        .status(400)
        .json({ status: false, msg: "نوع المنشور غير موجود" });
    }
    if (!title_ar || !title_en) {
      return res
        .status(400)
        .json({ status: false, msg: "العنوان بالعربية والإنجليزية مطلوب" });
    }
    if (type.code === "gallery" && !req.body.images && !image_ids) {
      return res
        .status(400)
        .json({ status: false, msg: "يجب تحميل صورة واحدة على الأقل للمعرض" });
    }

    // Find existing post
    const existingPost = await conn.posts.findOne({
      where: { id: postId },
    });
    if (!existingPost) {
      return res.status(404).json({ status: false, msg: "المنشور غير موجود" });
    }

    // Check slug uniqueness (exclude current post)
    const generatedSlug = slug || existingPost.slug;
    const slugCheck = await conn.posts.findOne({
      where: { slug: generatedSlug, id: { [Op.ne]: postId } },
    });
    if (slugCheck) {
      return res.status(400).json({
        status: false,
        msg: "المعرف (slug) موجود بالفعل، اختر معرفًا آخر",
      });
    }

    // Prepare post data
    const postData = {
      type_id,
      slug: generatedSlug,
      title_ar,
      title_en,
      content_ar: content_ar || null,
      content_en: content_en || null,
      image_url: image_url || existingPost.image_url,
      video_url: video_url || existingPost.video_url,
      is_featured: is_featured === "1" || is_featured === true,
      is_active: is_active === "1" || is_active === true,
    };

    // Update post
    await conn.posts.update(postData, { where: { id: postId } });

    // Handle gallery images if type.code is gallery
    let galleryImages = [];

    if (type.code === "gallery") {
      // Delete old images not included in image_ids
      if (image_ids) {
        await conn.post_images.destroy({
          where: {
            post_id: postId,
            id: { [Op.notIn]: image_ids.split(",") },
          },
        });
      } else {
        await conn.post_images.destroy({ where: { post_id: postId } });
      }

      // Add new images
      let images = req.body.images || [];
      if (images.length) {
        galleryImages = images.map((file, index) => ({
          post_id: postId,
          image_url: file,
          sort_order:
            sort_orders && sort_orders[index]
              ? parseInt(sort_orders[index])
              : index,
        }));
        await conn.post_images.bulkCreate(galleryImages);
      }
    }

    // Fetch updated post
    const updatedPost = await conn.posts.findOne({ where: { id: postId } });
    const updatedGalleryImages =
      type.code === "gallery"
        ? await conn.post_images.findAll({ where: { post_id: postId } })
        : [];

    // Prepare response data
    const responseData = {
      post: updatedPost,
      galleryImages: updatedGalleryImages,
    };

    res.status(200).json({
      status: true,
      data: responseData,
      msg: "تم تحديث المنشور بنجاح",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, msg: "حدث خطأ ما في السيرفر" });
  }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deletePosts = async (req, res, next) => {
  try {
    const category = await conn.posts.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (category?.image) {
      fs.unlink(category.image, (err) => {
        if (err) console.log(err);
        else {
          console.log("\nDeleted file successfuly");

          // Get the files in current directory
          // after deletion
        }
      });
    }

    await conn.posts.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ status: true, msg: `data deleted successfully` });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      msg: `حدث خطأ ما في السيرفر`,
    });
  }
};
