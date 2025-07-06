-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 02 يونيو 2025 الساعة 12:06
-- إصدار الخادم: 8.0.42-0ubuntu0.22.04.1
-- PHP Version: 8.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `confe`
--

-- --------------------------------------------------------

--
-- بنية الجدول `chats`
--

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `research_id` int DEFAULT NULL,
  `community_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `community_categories`
--

CREATE TABLE `community_categories` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `community_categories`
--

INSERT INTO `community_categories` (`id`, `name`, `name_en`, `created`, `updated`) VALUES
(1, 'Sociology', 'Sociology', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(2, 'Psychology', 'Psychology', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(3, 'Philosophy', 'Philosophy', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(4, 'Anthropology', 'Anthropology', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(5, 'History', 'History', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(6, 'Political Science', 'Political Science', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(7, 'International Relations', 'International Relations', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(8, 'Law', 'Law', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(9, 'Education', 'Education', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(10, 'Media and Communication', 'Media and Communication', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(11, 'Linguistics', 'Linguistics', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(12, 'Cultural Studies', 'Cultural Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(13, 'Gender Studies', 'Gender Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(14, 'Islamic Studies', 'Islamic Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(15, 'Arabic Literature', 'Arabic Literature', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(16, 'General Sciences', 'General Sciences', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(17, 'Biology', 'Biology', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(18, 'Chemistry', 'Chemistry', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(19, 'Physics', 'Physics', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(20, 'Mathematics', 'Mathematics', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(21, 'Geology', 'Geology', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(22, 'Environmental Sciences', 'Environmental Sciences', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(23, 'Astronomy', 'Astronomy', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(24, 'Marine Sciences', 'Marine Sciences', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(25, 'Medicine', 'Medicine', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(26, 'Public Health', 'Public Health', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(27, 'Nursing', 'Nursing', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(28, 'Pharmacy', 'Pharmacy', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(29, 'Dentistry', 'Dentistry', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(30, 'Biomedical Sciences', 'Biomedical Sciences', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(31, 'Nutrition', 'Nutrition', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(32, 'Physiotherapy', 'Physiotherapy', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(33, 'Medical Technology', 'Medical Technology', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(34, 'Computer Science', 'Computer Science', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(35, 'Artificial Intelligence', 'Artificial Intelligence', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(36, 'Information Systems', 'Information Systems', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(37, 'Cybersecurity', 'Cybersecurity', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(38, 'Electrical Engineering', 'Electrical Engineering', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(39, 'Mechanical Engineering', 'Mechanical Engineering', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(40, 'Civil Engineering', 'Civil Engineering', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(41, 'Chemical Engineering', 'Chemical Engineering', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(42, 'Architecture', 'Architecture', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(43, 'Renewable Energy', 'Renewable Energy', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(44, 'Robotics', 'Robotics', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(45, 'Public Administration', 'Public Administration', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(46, 'Administrative Sciences', 'Administrative Sciences', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(47, 'Business Administration', 'Business Administration', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(48, 'Accounting', 'Accounting', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(49, 'Finance', 'Finance', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(50, 'Marketing', 'Marketing', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(51, 'Human Resource Management', 'Human Resource Management', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(52, 'Entrepreneurship', 'Entrepreneurship', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(53, 'Economics', 'Economics', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(54, 'Supply Chain Management', 'Supply Chain Management', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(55, 'International Business', 'International Business', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(56, 'Fine Arts', 'Fine Arts', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(57, 'Graphic Design', 'Graphic Design', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(58, 'Interior Design', 'Interior Design', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(59, 'Fashion Design', 'Fashion Design', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(60, 'Performing Arts', 'Performing Arts', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(61, 'Film and Media Studies', 'Film and Media Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(62, 'Sustainability Studies', 'Sustainability Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(63, 'Urban Studies', 'Urban Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(64, 'Data Science', 'Data Science', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(65, 'Peace and Conflict Studies', 'Peace and Conflict Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(66, 'Development Studies', 'Development Studies', '2025-05-28 14:36:22', '2025-05-28 14:36:22'),
(67, 'Innovation and Technology', 'Innovation and Technology', '2025-05-28 14:36:22', '2025-05-28 14:36:22');

-- --------------------------------------------------------

--
-- بنية الجدول `community_universities`
--

CREATE TABLE `community_universities` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `community_universities`
--

INSERT INTO `community_universities` (`id`, `name`, `name_en`, `created`, `updated`) VALUES
(1, 'University of Cordoba', 'University of Cordoba', '2025-05-28 14:38:56', '2025-05-28 14:38:56');

-- --------------------------------------------------------

--
-- بنية الجدول `conferences`
--

CREATE TABLE `conferences` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description_en` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `paper_submition` date DEFAULT NULL,
  `notification` date DEFAULT NULL,
  `camera_ready` date DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `registration_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` int DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `conferences`
--

INSERT INTO `conferences` (`id`, `title`, `title_en`, `description`, `description_en`, `start_date`, `end_date`, `paper_submition`, `notification`, `camera_ready`, `location`, `registration_link`, `file`, `image`, `category_id`, `created`, `updated`) VALUES
(1, 'المؤتمر العالمي للمرافق 2025', 'المؤتمر العالمي للمرافق 2025', 'تحـت رعايـة سـمو الشـيخ خالـد بـن محمـد بـن زايـد آل نهيـان ولي عهـد أبوظبـي رئيـس المجلـس التنفيذي لإمـارة أبوظبـي.\r\n\r\nيجمـع مؤتمـر العالمـي للمرافـق قـادة الصناعـة فـي المجـال ليقـدم فرصـة متميـزة لعـرض التقنيـات الرائـدة واستكشـاف آفـاق جديـدة للاسـتثمار. ومـع التركيـز على دمـج مصـادر الطاقـة المتجـددة، وتعزيـز مرونـة الشـبكة، وتحسـين إدارة الميـاه، فـإن الحـدث يشـكل مسـتقبلًا مسـتداماً وموثوقـاً وشـاملًا للمرافـق فـي جميـع أنحـاء العالـم.', 'تحـت رعايـة سـمو الشـيخ خالـد بـن محمـد بـن زايـد آل نهيـان ولي عهـد أبوظبـي رئيـس المجلـس التنفيذي لإمـارة أبوظبـي.\r\n\r\nيجمـع مؤتمـر العالمـي للمرافـق قـادة الصناعـة فـي المجـال ليقـدم فرصـة متميـزة لعـرض التقنيـات الرائـدة واستكشـاف آفـاق جديـدة للاسـتثمار. ومـع التركيـز على دمـج مصـادر الطاقـة المتجـددة، وتعزيـز مرونـة الشـبكة، وتحسـين إدارة الميـاه، فـإن الحـدث يشـكل مسـتقبلًا مسـتداماً وموثوقـاً وشـاملًا للمرافـق فـي جميـع أنحـاء العالـم.', '2025-05-27 07:00:00', '2025-05-29 07:00:00', NULL, NULL, NULL, 'قاعات 3 - 6، الردهة الوسطى وقاعات المؤتمرات (أ) و(ب)', 'https://www.worldutilitiescongress.com/', NULL, 'public/conference/1748533147174483.jfif', 2, '2025-05-29 15:39:07', '2025-05-29 15:43:47'),
(2, 'صيف أبوظبي الرياضي (ADSS)', 'صيف أبوظبي الرياضي (ADSS)', 'يعد صيف أبوظبي الرياضي أكبر حدث من نوعه في المنطقة، والذي يهدف إلى تشجيع جميع أفراد المجتمع على اتباع أنماط حياة صحية خلال فصل الصيف في بيئة مريحة ومكيفة، يُعد المكان المثالي للحفاظ على صحتك. كما يقدم أنشطة لجميع الأعمار ومستويات اللياقة البدنية، مما يضمن المتعة واللياقة للعائلة. سواء كنت ترغب في ممارسة التمارين أو الاستمتاع بالأنشطة الرياضية، فإن صيف أبوظبي الرياضي يقدم شيئاً للجميع هذا الصيف.\r\n\r\n', 'يعد صيف أبوظبي الرياضي أكبر حدث من نوعه في المنطقة، والذي يهدف إلى تشجيع جميع أفراد المجتمع على اتباع أنماط حياة صحية خلال فصل الصيف في بيئة مريحة ومكيفة، يُعد المكان المثالي للحفاظ على صحتك. كما يقدم أنشطة لجميع الأعمار ومستويات اللياقة البدنية، مما يضمن المتعة واللياقة للعائلة. سواء كنت ترغب في ممارسة التمارين أو الاستمتاع بالأنشطة الرياضية، فإن صيف أبوظبي الرياضي يقدم شيئاً للجميع هذا الصيف.\r\n\r\n', '2025-06-05 07:00:00', '2025-08-21 07:00:00', '2025-05-29', NULL, NULL, 'قاعات 5-11', 'https://www.adsummersports.ae/?lang=en', NULL, 'public/conference/1748533465394167.jpg', 2, '2025-05-29 15:44:25', '2025-05-29 15:44:25'),
(4, 'حفل تخريج جامعة زايد', 'حفل تخريج جامعة زايد', 'الإمارات تحتفل بنجوم المستقبل ونجاحهم في مراسم التخرّج.\r\n\r\n', 'الإمارات تحتفل بنجوم المستقبل ونجاحهم في مراسم التخرّج.\r\n\r\n', '2025-06-17 07:00:00', '2025-05-19 07:00:00', NULL, NULL, NULL, 'قاعة أبوظبي للمؤتمرات', NULL, NULL, 'public/conference/174853432842756.jpg', 2, '2025-05-29 15:58:48', '2025-05-29 15:58:48'),
(5, 'سباق هايروكس العالمي لتحدي اللياقة', 'سباق هايروكس العالمي لتحدي اللياقة', 'لأول مرة في أبوظبي، سباق هايروكس العالمي لتحدي اللياقة ينطلق ضمن فعاليات صيف أبوظبي الرياضي !\r\nاستعد لخوض تحدٍ فريد يجمع بين اللياقة البدنية والمنافسة الحماسية. اختبر قوتك وتحملك، سواء كنت محترفًا أو تخوض التجربة لأول مرة، وكن جزءًا من مجتمع عالمي يعشق التحدي.', 'لأول مرة في أبوظبي، سباق هايروكس العالمي لتحدي اللياقة ينطلق ضمن فعاليات صيف أبوظبي الرياضي !\r\nاستعد لخوض تحدٍ فريد يجمع بين اللياقة البدنية والمنافسة الحماسية. اختبر قوتك وتحملك، سواء كنت محترفًا أو تخوض التجربة لأول مرة، وكن جزءًا من مجتمع عالمي يعشق التحدي.', '2025-07-19 07:00:00', '2025-07-19 07:00:00', NULL, NULL, NULL, 'قاعات 1-3', NULL, NULL, 'public/conference/1748534584453449.jpg', 2, '2025-05-29 16:03:04', '2025-05-29 16:03:04'),
(6, 'المؤتمر الدولي - IDA 2025', 'المؤتمر الدولي - IDA 2025', 'المؤتمر السنوي لجائزة التنين الدولية ) IDA ( هو حدث مرموق يحتفي بالتميز في الصناعات المالية والتأمينية. ويجمع المؤتمر بين المهنيين العالميين لتكريم الإنجازات البارزة في المبيعات والقيادة والخدمة. ويضم المؤتمر خطابات رئيسية ومناقشات جماعية وورش عمل حول أحدث اتجاهات واستراتيجيات الصناعة، مما يوفر فرص التواصل لتعزيز الاتصالات العالمية وتعزيز التنمية المهنية عبر هذه القطاعات.\r\n\r\n', 'المؤتمر السنوي لجائزة التنين الدولية ) IDA ( هو حدث مرموق يحتفي بالتميز في الصناعات المالية والتأمينية. ويجمع المؤتمر بين المهنيين العالميين لتكريم الإنجازات البارزة في المبيعات والقيادة والخدمة. ويضم المؤتمر خطابات رئيسية ومناقشات جماعية وورش عمل حول أحدث اتجاهات واستراتيجيات الصناعة، مما يوفر فرص التواصل لتعزيز الاتصالات العالمية وتعزيز التنمية المهنية عبر هذه القطاعات.\r\n\r\n', '2025-08-09 07:00:00', '2025-08-12 07:00:00', NULL, NULL, NULL, 'قاعات 1-7, الردهة الوسطى، قاعة المؤتمرات (أ) و(ب)', NULL, NULL, 'public/conference/1748534751669947.jpg', 2, '2025-05-29 16:05:51', '2025-05-29 16:05:51'),
(7, 'معرض أبوظبي الدولي للصيد والفروسية 2025', 'معرض أبوظبي الدولي للصيد والفروسية 2025', 'تحت رعاية سمو الشيخ حمدان بن زايد آل نهيان ممثل الحاكم في منطقة الظفرة، رئيس نادي صقاري الإمارات، تُقام النسخة العشرون من معرض أبوظبي الدولي للصيد والفروسية (ADIHEX) خلال الفترة من 30 أغسطس ولغاية 7 سبتمبر 2025 في مركز أبوظبي الوطني للمعارض (أدنيك) تحت شعار \"استدامة وتراث... بروح متجددة\".\r\n\r\nيستقطب المعرض، الذي يُنظّمه نادي صقاري الإمارات، زوّاراً مُهتمّين وشغوفين محليين ودوليين من صانعي القرار، ومن الذين يتمتعون بقوة شرائية عالية ويواصلون اهتمامهم بمنح الأولوية للقيم البيئية والثقافية والتراثية وللرياضات الأصيلة وللصيد المُستدام. وفي الوقت نفسه، يُوفّر معرض أبوظبي الدولي للصيد والفروسية فرصة فريدة للشركات والعلامات التجارية المحلية والإقليمية والدولية للمُشاركة والتواجد ومُقابلة الشركاء والعملاء المُحتملين وجهاً لوجه، سعياً منهم لبناء علاقات تجارية ثنائية قوية.\r\n\r\n', 'تحت رعاية سمو الشيخ حمدان بن زايد آل نهيان ممثل الحاكم في منطقة الظفرة، رئيس نادي صقاري الإمارات، تُقام النسخة العشرون من معرض أبوظبي الدولي للصيد والفروسية (ADIHEX) خلال الفترة من 30 أغسطس ولغاية 7 سبتمبر 2025 في مركز أبوظبي الوطني للمعارض (أدنيك) تحت شعار \"استدامة وتراث... بروح متجددة\".\r\n\r\nيستقطب المعرض، الذي يُنظّمه نادي صقاري الإمارات، زوّاراً مُهتمّين وشغوفين محليين ودوليين من صانعي القرار، ومن الذين يتمتعون بقوة شرائية عالية ويواصلون اهتمامهم بمنح الأولوية للقيم البيئية والثقافية والتراثية وللرياضات الأصيلة وللصيد المُستدام. وفي الوقت نفسه، يُوفّر معرض أبوظبي الدولي للصيد والفروسية فرصة فريدة للشركات والعلامات التجارية المحلية والإقليمية والدولية للمُشاركة والتواجد ومُقابلة الشركاء والعملاء المُحتملين وجهاً لوجه، سعياً منهم لبناء علاقات تجارية ثنائية قوية.', '2025-08-30 07:00:00', '2025-09-07 07:00:00', NULL, NULL, NULL, 'قاعات 1-11، قاعة أبوظبي للمؤتمرات', 'https://www.adihex.com/ar/', NULL, 'public/conference/1748535001574756.jpg', 2, '2025-05-29 16:10:01', '2025-05-29 16:10:01');

-- --------------------------------------------------------

--
-- بنية الجدول `conference_agenda`
--

CREATE TABLE `conference_agenda` (
  `id` int NOT NULL,
  `conference_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `speaker` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `conference_applicant_request`
--

CREATE TABLE `conference_applicant_request` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `academic_level` enum('Master','PhD','Postdoc') NOT NULL,
  `major_field` varchar(100) NOT NULL,
  `university` varchar(150) NOT NULL,
  `university_email` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `country_residence` varchar(100) NOT NULL,
  `conference_title` varchar(200) NOT NULL,
  `main_language` varchar(50) NOT NULL,
  `supporting_institution` varchar(150) DEFAULT NULL,
  `proposed_date_start` date NOT NULL,
  `duration_days` int NOT NULL,
  `location_type` enum('Online','On-site','Hybrid') NOT NULL,
  `venue` varchar(200) DEFAULT NULL,
  `objectives` text NOT NULL,
  `notes` text,
  `status_id` int DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- إرجاع أو استيراد بيانات الجدول `conference_applicant_request`
--

INSERT INTO `conference_applicant_request` (`id`, `user_id`, `full_name`, `academic_level`, `major_field`, `university`, `university_email`, `phone_number`, `country_residence`, `conference_title`, `main_language`, `supporting_institution`, `proposed_date_start`, `duration_days`, `location_type`, `venue`, `objectives`, `notes`, `status_id`, `created`, `updated`) VALUES
(1, 23, 'Ahmed Adil Mohmed Abuzaid', 'Master', 'Software engineering', 'alneelain', 'amnnn80@gmail.com', '+256125803725', 'Uganda', 'Hello ', 'Arabic', 'hi', '2025-05-29', 1, 'Online', NULL, 'hi', 'hi test api is here', NULL, '2025-05-26 15:09:51', '2025-05-26 15:09:51');

-- --------------------------------------------------------

--
-- بنية الجدول `conference_categories`
--

CREATE TABLE `conference_categories` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `conference_categories`
--

INSERT INTO `conference_categories` (`id`, `name`, `name_en`, `image`, `created`, `updated`) VALUES
(1, 'Academic Conferences', 'Academic Conferences', 'public/conference-categories/174827641559410.jpg', '2025-05-26 16:20:15', '2025-05-26 16:20:15'),
(2, 'General Events', 'General Events', 'public/conference-categories/1748276451522244.jpg', '2025-05-26 16:20:51', '2025-05-26 16:20:51');

-- --------------------------------------------------------

--
-- بنية الجدول `conference_excerpts`
--

CREATE TABLE `conference_excerpts` (
  `id` int NOT NULL,
  `conference_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `conference_registrations`
--

CREATE TABLE `conference_registrations` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `conference_id` int NOT NULL,
  `paid` tinyint NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `conference_speakers`
--

CREATE TABLE `conference_speakers` (
  `id` int NOT NULL,
  `conference_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `job_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `organization` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `library_publications`
--

CREATE TABLE `library_publications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `abstract` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `university_id` int DEFAULT NULL,
  `submission_date` timestamp NOT NULL,
  `publication_date` timestamp NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `library_publications`
--

INSERT INTO `library_publications` (`id`, `user_id`, `title`, `abstract`, `email`, `user_name`, `phone`, `file`, `image`, `status_id`, `category_id`, `university_id`, `submission_date`, `publication_date`, `created`, `updated`) VALUES
(1, 28, 'THE IMPACT OF PUBLIC DIPLOMACY ON SOFT POWER STRATEGY: MODERATING ROLE OF MEDIA AND COMMUNICATION', 'ABSTRACT\r\nPublic diplomacy is the hub of strengthening soft power and international relations, where media and communication play an important role in boosting soft power and international relations. Therefore, this study presents the impact of public diplomacy on soft power and international relations within the specific context of the UAE. In addition, the study examines the moderating role of media and communication between public diplomacy and international relations, soft power. It employs SEM analysis to empirically evaluate the relationships between these variables as viewed by UAE citizens. The research supports the hypothesis that public diplomacy significantly influences soft power, with approximately 46.7% of the variance in soft power being explainable by public diplomacy. This suggests that enhancing public diplomacy through improved foreign policy, international cooperation, leadership, and economic aid can significantly contribute to increasing the UAE soft power. The study also identifies four crucial determinants of soft power: foreign policy, international cooperation, UAE leadership, and economic aid. All four factors have a statistically significant positive impact on soft power. This underlines that efforts to augment the UAE soft power should focus on these areas.\r\nHowever, the potential moderating role of media and communication in the relationship between public diplomacy (comprising foreign policy, international cooperation, leadership, and economic aids) and soft power (including governance and people & value) could not be definitively confirmed or refuted, due to a lack of an interaction term in the regression model. The analysis further reveals a significant positive relationship between public diplomacy and international relations, indicating that effective public diplomacy strategies can enhance international relations. Additionally, foreign policy, international cooperation, and UAE leadership significantly influence international relations, while economic aid does not substantially affect them. Finally, the study proves that soft power mediates the relationship between public diplomacy and international relations. This suggests that soft power shapes how public diplomacy affects international relations. Consequently, enhancing international relations through public diplomacy should consider the integral role of soft power. Overall, this study underscores the significant role of public diplomacy in shaping soft power and international relations. It also emphasizes the necessity of considering soft power as a mediator between public diplomacy and international relations. These findings offer valuable insights for policymakers in the UAE and other nations aiming to strengthen their international standing through public diplomacy and soft power.\r\nOn the other hand, the qualitative analysis of the perceptions of UAE citizens on the country\'s use of public diplomacy, media communication, and soft power strategies in shaping its international image and relationships. The research involved extensive qualitative interviews, eliciting views on various aspects, including foreign policy, international cooperation, leadership, economic aid, and the media\'s role in promoting Emirati culture and values. The research got 352 completed and filled out survey questionnaires out of 500. Qualitative data was collected through 6 semi-structured interviews with respondents. The study found a significant positive correlation between public diplomacy elements (foreign policy, international cooperation, leadership, and economic aid) and dimensions of soft power (governance, people and values, media, and communications). The research suggests that UAE media platforms, backed by appropriate regulations and strategic objectives, are strong enough to influence global audiences positively, promoting UAE cultural values and its soft power strategy. The study also highlights opportunities for further development in UAE public diplomacy, including promoting diversity and inclusiveness, increasing social media engagement, and improving access to Emirati culture, while maintaining a balance between traditional values and modernization. The UAE also upholds freedom of speech within a framework of governance that ensures social harmony and national security.\r\nThe findings revealed that UAE investment in infrastructure, education, research, technological innovation, and support for global environmental initiatives significantly contributed to enhancing the nation\'s soft power. It also highlighted the positive impact of public diplomacy and soft power on international relations from the UAE citizens\' perspective. The study concludes by underscoring the critical role of media and communication in moderating the relationship between public diplomacy and soft power, ultimately shaping UAE international relations.\r\n\r\nKeywords: Public diplomacy, soft power, international relations, UAE context', 'confe.ae@gmail.com', 'Amal', '+971', 'public/library-publications/1748443593998425.pdf', 'public/library-publications/1/1748580454016307.jpg', 1, 16, 1, '2025-05-28 21:00:00', '2025-05-30 21:00:00', '2025-05-28 14:46:34', '2025-05-28 14:46:34');

-- --------------------------------------------------------

--
-- بنية الجدول `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL,
  `status` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `payment_types`
--

CREATE TABLE `payment_types` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `research_communities`
--

CREATE TABLE `research_communities` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `abstract` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` int DEFAULT NULL,
  `status_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `research_papers`
--

CREATE TABLE `research_papers` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `abstract` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status_id` int NOT NULL,
  `submission_date` timestamp NOT NULL,
  `publication_date` timestamp NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `research_status`
--

CREATE TABLE `research_status` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `research_status`
--

INSERT INTO `research_status` (`id`, `name`, `name_en`, `code`) VALUES
(1, 'Published', 'Published', 'Published');

-- --------------------------------------------------------

--
-- بنية الجدول `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `price` float NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `status_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `subscription_plan`
--

CREATE TABLE `subscription_plan` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` double(10,2) NOT NULL,
  `period` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `subscription_plan`
--

INSERT INTO `subscription_plan` (`id`, `name`, `name_en`, `description`, `description_en`, `price`, `period`, `code`) VALUES
(1, 'Silver Package', 'Silver Package', 'Silver ', 'Silver ', 1250.00, 'Year', 'Silver'),
(2, 'Gold Package', 'Gold Package', 'Gold Package', 'Gold Package\r\n', 1800.00, 'Year', 'Gold'),
(3, 'Platinum Package', 'Platinum Package', 'Platinum Package', 'Platinum Package', 2500.00, 'Year', 'Platinum');

-- --------------------------------------------------------

--
-- بنية الجدول `subscription_plan_features`
--

CREATE TABLE `subscription_plan_features` (
  `id` int NOT NULL,
  `feature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `feature_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `plan_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `subscription_plan_features`
--

INSERT INTO `subscription_plan_features` (`id`, `feature`, `feature_en`, `plan_id`) VALUES
(1, '✅ Scientific Research Publication (AED 450 per paper)', '✅ Scientific Research Publication (AED 450 per paper)', 1),
(2, '✅ One Conference Attendance (AED 300)', '✅ One Conference Attendance (AED 300)', 1),
(3, '❌ Additional Conferences Not Included', '❌ Additional Conferences Not Included', 1),
(4, '❌ Workshops & Seminars Not Included', '❌ Workshops & Seminars Not Included', 1),
(5, '🧑‍🏫 One Academic Consultation Session (AED 250)', '🧑‍🏫 One Academic Consultation Session (AED 250)', 1),
(6, '📄 File Access: View up to 30% of each file content', '📄 File Access: View up to 30% of each file content', 1),
(7, '✅ Scientific Research Publication (Included – Free)', '✅ Scientific Research Publication (Included – Free)', 2),
(8, '✅ One Conference Attendance (Included)', '✅ One Conference Attendance (Included)', 2),
(9, '❌ Additional Conferences Not Included', '❌ Additional Conferences Not Included', 2),
(10, '❌ Workshops & Seminars Not Included', '❌ Workshops & Seminars Not Included', 2),
(11, '🧑‍🏫 Two Academic Consultation Sessions', '🧑‍🏫 Two Academic Consultation Sessions', 2),
(12, '📄 File Access: View up to 50% of each file content', '📄 File Access: View up to 50% of each file content', 2),
(13, '🆓 Scientific Research Publication (Completely Free)', '🆓 Scientific Research Publication (Completely Free)', 3),
(14, '✅ One Conference Attendance (Included)', '✅ One Conference Attendance (Included)', 3),
(15, '✅ Additional Conferences Included', '✅ Additional Conferences Included', 3),
(16, '✅ Workshops & Seminars Included', '✅ Workshops & Seminars Included', 3),
(17, '🧑‍🏫 Three Academic Consultation Sessions', '🧑‍🏫 Three Academic Consultation Sessions', 3),
(18, '📄 File Access: Full access to all file content (100%)', '📄 File Access: Full access to all file content (100%)', 3);

-- --------------------------------------------------------

--
-- بنية الجدول `subscription_status`
--

CREATE TABLE `subscription_status` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `otp_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role_id` int NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `name`, `bio`, `email`, `phone`, `image`, `password`, `otp_token`, `role_id`, `created`, `updated`) VALUES
(23, 'Ahmed Adil Mohmed Abuzaid', 'Hello this is me ahmed', 'amnnn80@gmail.com', 'amnnn80@gmail.com', 'public/users/23/1748092839060517.jpeg', '$2b$10$c2Kq3zekWsVfIWkMmaoCy.RWDrch4rqR4/bSehqDQW7XNpaYctjDa', NULL, 2, '2025-05-10 19:27:18', '2025-05-24 13:20:39'),
(27, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1747666127808480.png', '$2b$10$a3JnUmqh5Z1di4g4uyFmqudBI554VaBpYOoktXqpGB/zjStHndtJ.', NULL, 1, '2025-05-19 14:48:47', '2025-05-19 14:48:47'),
(28, 'Amal', NULL, 'admin@confe.ae', '125803725', 'public/users/174826688344242.jpg', '$2b$10$DvvXgywewpiUa8FautF/AOP.0ARaTJ53pVv1D9qIaYGiSmbRvTcny', NULL, 3, '2025-05-26 13:41:23', '2025-05-26 13:41:23'),
(29, 'Ahmed Admin', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748532262013918.jpg', '$2b$10$5gcr17KNSdQPEepavU6iYOTOVSFwCjsbvCoo08s20EvPvzSCUMdj2', NULL, 3, '2025-05-29 15:24:22', '2025-05-29 15:24:22'),
(30, 'Wadima Alameri', NULL, 'wadima0907@gmail.com', '0582778426', 'null', '$2b$10$d6Cy4fRE/Upb5r9Opv6W..CsVmAv2uKLGiFAbsM6nRdzMQJ12fEc.', NULL, 1, '2025-05-30 14:39:21', '2025-05-30 14:39:21'),
(31, 'Wadima Alameri', NULL, 'wadima0907@gmail.com', '0582778426', 'public/users/1748616035566874.jpg', '$2b$10$6eE8uHKCMKBO5jLbZJh2TO64EhHHPsd.wPPp9UOL2OpVNnCNJuk.i', NULL, 1, '2025-05-30 14:40:35', '2025-05-30 14:40:35'),
(32, 'Wadima Alameri', NULL, 'wadima0907@gmail.com', '0582778426', 'public/users/1748616097016392.jpg', '$2b$10$imywXj58/knYyqdBEEji3eXCjlwACi.4uNANhKbOihqrC.DI0dWWK', NULL, 1, '2025-05-30 14:41:37', '2025-05-30 14:41:37'),
(33, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748616238675567.jpg', '$2b$10$twaIS/WKQKXcm.u4rm/y7urvR6/.ByHSrz6cwW5Js3QJV0c37B7iO', NULL, 1, '2025-05-30 14:43:58', '2025-05-30 14:43:58'),
(34, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748616693691879.jpg', '$2b$10$RePUydmcooBXpmbB/AC17.r6H84lR4gv5QWTKiA2OgHZ8y0Xvxcuu', NULL, 1, '2025-05-30 14:51:33', '2025-05-30 14:51:33'),
(35, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748616767427765.jpg', '$2b$10$ki1J8BHbFYVxcX1BfwgZye72H0sHMzOVGAGYBUP6oqV0WbUJj8XMK', NULL, 1, '2025-05-30 14:52:47', '2025-05-30 14:52:47'),
(36, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748616818585153.jpg', '$2b$10$zyZKmn/ZG3GxdSI.C6vlN.YDd094ywIrS5JPA/st5QxiTWH/g2uzO', NULL, 1, '2025-05-30 14:53:38', '2025-05-30 14:53:38'),
(37, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748616874209361.jpg', '$2b$10$w4p6.g3RQbXAUhjfmczt0OVuwdXI7p3PuvEIT85WJI./.ljsIABaO', NULL, 1, '2025-05-30 14:54:34', '2025-05-30 14:54:34'),
(38, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748617076730753.jpg', '$2b$10$mRXnifT/nPoyjeWAfS0fu.cnQtNlebqHfBpcdp3PX9ZAiynF9iT5m', NULL, 1, '2025-05-30 14:57:56', '2025-05-30 14:57:56'),
(39, 'Ahmed Adil Mohmed Abuzaid', NULL, 'amnnn80@gmail.com', '125803725', 'public/users/1748617185016313.jpg', '$2b$10$XCZztb9ya/yLb7Bdf60CjuSd1LYKQtLU3zQrFgcN83./buPzCpKVa', NULL, 1, '2025-05-30 14:59:45', '2025-05-30 14:59:45');

-- --------------------------------------------------------

--
-- بنية الجدول `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `user_roles`
--

INSERT INTO `user_roles` (`id`, `name`, `name_en`, `code`, `created`, `updated`) VALUES
(1, 'مدير', 'manager', 'MANAGER', '2025-05-10 19:18:49', '2025-05-10 19:18:49'),
(2, 'طالب', 'STUDENT', 'STD', '2025-05-10 19:18:49', '2025-05-10 19:18:49'),
(3, 'مسؤول', 'Admin', 'ADMIN\r\n', '2025-05-10 19:19:10', '2025-05-10 19:19:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `chats_ibfk_1` (`community_id`);

--
-- Indexes for table `community_categories`
--
ALTER TABLE `community_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `community_universities`
--
ALTER TABLE `community_universities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conferences`
--
ALTER TABLE `conferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `conference_agenda`
--
ALTER TABLE `conference_agenda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conference_agenda_ibfk_1` (`conference_id`);

--
-- Indexes for table `conference_applicant_request`
--
ALTER TABLE `conference_applicant_request`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `university_email` (`university_email`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `conference_categories`
--
ALTER TABLE `conference_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conference_excerpts`
--
ALTER TABLE `conference_excerpts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conference_excerpts_ibfk_1` (`conference_id`);

--
-- Indexes for table `conference_registrations`
--
ALTER TABLE `conference_registrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conference_speakers`
--
ALTER TABLE `conference_speakers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conference_speakers_ibfk_1` (`conference_id`);

--
-- Indexes for table `library_publications`
--
ALTER TABLE `library_publications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `university_id` (`university_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `research_communities`
--
ALTER TABLE `research_communities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `research_papers`
--
ALTER TABLE `research_papers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `research_status`
--
ALTER TABLE `research_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription_plan_features`
--
ALTER TABLE `subscription_plan_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscription_plan_features_ibfk_1` (`plan_id`);

--
-- Indexes for table `subscription_status`
--
ALTER TABLE `subscription_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `community_categories`
--
ALTER TABLE `community_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `community_universities`
--
ALTER TABLE `community_universities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `conferences`
--
ALTER TABLE `conferences`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `conference_agenda`
--
ALTER TABLE `conference_agenda`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conference_applicant_request`
--
ALTER TABLE `conference_applicant_request`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `conference_categories`
--
ALTER TABLE `conference_categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `conference_excerpts`
--
ALTER TABLE `conference_excerpts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conference_registrations`
--
ALTER TABLE `conference_registrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conference_speakers`
--
ALTER TABLE `conference_speakers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `library_publications`
--
ALTER TABLE `library_publications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `research_communities`
--
ALTER TABLE `research_communities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `research_papers`
--
ALTER TABLE `research_papers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `research_status`
--
ALTER TABLE `research_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subscription_plan_features`
--
ALTER TABLE `subscription_plan_features`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subscription_status`
--
ALTER TABLE `subscription_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- قيود الجداول المحفوظة
--

--
-- القيود للجدول `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `research_communities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- القيود للجدول `conferences`
--
ALTER TABLE `conferences`
  ADD CONSTRAINT `conferences_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `conference_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- القيود للجدول `conference_agenda`
--
ALTER TABLE `conference_agenda`
  ADD CONSTRAINT `conference_agenda_ibfk_1` FOREIGN KEY (`conference_id`) REFERENCES `conferences` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- القيود للجدول `conference_applicant_request`
--
ALTER TABLE `conference_applicant_request`
  ADD CONSTRAINT `conference_applicant_request_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `conference_applicant_request_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `research_status` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- القيود للجدول `conference_excerpts`
--
ALTER TABLE `conference_excerpts`
  ADD CONSTRAINT `conference_excerpts_ibfk_1` FOREIGN KEY (`conference_id`) REFERENCES `conferences` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- القيود للجدول `conference_speakers`
--
ALTER TABLE `conference_speakers`
  ADD CONSTRAINT `conference_speakers_ibfk_1` FOREIGN KEY (`conference_id`) REFERENCES `conferences` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- القيود للجدول `library_publications`
--
ALTER TABLE `library_publications`
  ADD CONSTRAINT `library_publications_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `research_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `library_publications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `library_publications_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `community_categories` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `library_publications_ibfk_4` FOREIGN KEY (`university_id`) REFERENCES `community_universities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- القيود للجدول `research_communities`
--
ALTER TABLE `research_communities`
  ADD CONSTRAINT `research_communities_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `community_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `research_communities_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `research_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `research_communities_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- القيود للجدول `research_papers`
--
ALTER TABLE `research_papers`
  ADD CONSTRAINT `research_papers_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `research_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `research_papers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- القيود للجدول `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `subscriptions_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `subscription_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- القيود للجدول `subscription_plan_features`
--
ALTER TABLE `subscription_plan_features`
  ADD CONSTRAINT `subscription_plan_features_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- القيود للجدول `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
