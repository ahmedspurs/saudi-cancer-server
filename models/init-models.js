var DataTypes = require("sequelize").DataTypes;
var _bank_accounts = require("./bank_accounts");
var _cases = require("./cases");
var _comprehensive_documents = require("./comprehensive_documents");
var _contact_messages = require("./contact_messages");
var _donation_cases = require("./donation_cases");
var _donation_categories = require("./donation_categories");
var _donations_common = require("./donations_common");
var _gift_donations = require("./gift_donations");
var _governance = require("./governance");
var _governance_categories = require("./governance_categories");
var _integration_links = require("./integration_links");
var _member_types = require("./member_types");
var _organization_members = require("./organization_members");
var _pain_relief_donations = require("./pain_relief_donations");
var _pain_relief_options = require("./pain_relief_options");
var _pain_relief_programs = require("./pain_relief_programs");
var _partners = require("./partners");
var _payment_methods = require("./payment_methods");
var _payments = require("./payments");
var _post_images = require("./post_images");
var _post_types = require("./post_types");
var _posts = require("./posts");
var _roles = require("./roles");
var _social_media_links = require("./social_media_links");
var _static_sections = require("./static_sections");
var _user_roles = require("./user_roles");
var _users = require("./users");

function initModels(sequelize) {
  var bank_accounts = _bank_accounts(sequelize, DataTypes);
  var cases = _cases(sequelize, DataTypes);
  var comprehensive_documents = _comprehensive_documents(sequelize, DataTypes);
  var contact_messages = _contact_messages(sequelize, DataTypes);
  var donation_cases = _donation_cases(sequelize, DataTypes);
  var donation_categories = _donation_categories(sequelize, DataTypes);
  var donations_common = _donations_common(sequelize, DataTypes);
  var gift_donations = _gift_donations(sequelize, DataTypes);
  var governance = _governance(sequelize, DataTypes);
  var governance_categories = _governance_categories(sequelize, DataTypes);
  var integration_links = _integration_links(sequelize, DataTypes);
  var member_types = _member_types(sequelize, DataTypes);
  var organization_members = _organization_members(sequelize, DataTypes);
  var pain_relief_donations = _pain_relief_donations(sequelize, DataTypes);
  var pain_relief_options = _pain_relief_options(sequelize, DataTypes);
  var pain_relief_programs = _pain_relief_programs(sequelize, DataTypes);
  var partners = _partners(sequelize, DataTypes);
  var payment_methods = _payment_methods(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var post_images = _post_images(sequelize, DataTypes);
  var post_types = _post_types(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var social_media_links = _social_media_links(sequelize, DataTypes);
  var static_sections = _static_sections(sequelize, DataTypes);
  var user_roles = _user_roles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  donation_cases.belongsTo(cases, { as: "case", foreignKey: "case_id"});
  cases.hasMany(donation_cases, { as: "donation_cases", foreignKey: "case_id"});
  donations_common.belongsTo(cases, { as: "case", foreignKey: "case_id"});
  cases.hasMany(donations_common, { as: "donations_commons", foreignKey: "case_id"});
  cases.belongsTo(donation_categories, { as: "category", foreignKey: "category_id"});
  donation_categories.hasMany(cases, { as: "cases", foreignKey: "category_id"});
  donations_common.belongsTo(donation_categories, { as: "category", foreignKey: "category_id"});
  donation_categories.hasMany(donations_common, { as: "donations_commons", foreignKey: "category_id"});
  pain_relief_programs.belongsTo(donation_categories, { as: "category", foreignKey: "category_id"});
  donation_categories.hasMany(pain_relief_programs, { as: "pain_relief_programs", foreignKey: "category_id"});
  donation_cases.belongsTo(donations_common, { as: "donation", foreignKey: "donation_id"});
  donations_common.hasMany(donation_cases, { as: "donation_cases", foreignKey: "donation_id"});
  gift_donations.belongsTo(donations_common, { as: "donation", foreignKey: "donation_id"});
  donations_common.hasMany(gift_donations, { as: "gift_donations", foreignKey: "donation_id"});
  pain_relief_donations.belongsTo(donations_common, { as: "donation", foreignKey: "donation_id"});
  donations_common.hasMany(pain_relief_donations, { as: "pain_relief_donations", foreignKey: "donation_id"});
  payments.belongsTo(donations_common, { as: "donation", foreignKey: "donation_id"});
  donations_common.hasMany(payments, { as: "donation_payments", foreignKey: "donation_id"});
  donations_common.belongsTo(gift_donations, { as: "gift", foreignKey: "gift_id"});
  gift_donations.hasMany(donations_common, { as: "donations_commons", foreignKey: "gift_id"});
  governance.belongsTo(governance_categories, { as: "category", foreignKey: "category_id"});
  governance_categories.hasMany(governance, { as: "governances", foreignKey: "category_id"});
  organization_members.belongsTo(member_types, { as: "type", foreignKey: "type_id"});
  member_types.hasMany(organization_members, { as: "organization_members", foreignKey: "type_id"});
  pain_relief_donations.belongsTo(pain_relief_options, { as: "donation_option", foreignKey: "donation_option_id"});
  pain_relief_options.hasMany(pain_relief_donations, { as: "pain_relief_donations", foreignKey: "donation_option_id"});
  pain_relief_donations.belongsTo(pain_relief_programs, { as: "program", foreignKey: "program_id"});
  pain_relief_programs.hasMany(pain_relief_donations, { as: "pain_relief_donations", foreignKey: "program_id"});
  payments.belongsTo(payment_methods, { as: "payment_method", foreignKey: "payment_method_id"});
  payment_methods.hasMany(payments, { as: "payments", foreignKey: "payment_method_id"});
  donations_common.belongsTo(payments, { as: "payment", foreignKey: "payment_id"});
  payments.hasMany(donations_common, { as: "donations_commons", foreignKey: "payment_id"});
  posts.belongsTo(post_types, { as: "type", foreignKey: "type_id"});
  post_types.hasMany(posts, { as: "posts", foreignKey: "type_id"});
  post_images.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(post_images, { as: "post_images", foreignKey: "post_id"});
  user_roles.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  roles.hasMany(user_roles, { as: "user_roles", foreignKey: "role_id"});
  cases.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(cases, { as: "cases", foreignKey: "user_id"});
  donations_common.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(donations_common, { as: "donations_commons", foreignKey: "user_id"});
  user_roles.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(user_roles, { as: "user_roles", foreignKey: "user_id"});

  return {
    bank_accounts,
    cases,
    comprehensive_documents,
    contact_messages,
    donation_cases,
    donation_categories,
    donations_common,
    gift_donations,
    governance,
    governance_categories,
    integration_links,
    member_types,
    organization_members,
    pain_relief_donations,
    pain_relief_options,
    pain_relief_programs,
    partners,
    payment_methods,
    payments,
    post_images,
    post_types,
    posts,
    roles,
    social_media_links,
    static_sections,
    user_roles,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
