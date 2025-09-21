<?php
/**
 * 荆州众志足球俱乐部 - 球员申请表单提交处理脚本
 * 用于接收前端表单数据并存储到MySQL数据库
 */

// 设置响应头为JSON格式
header('Content-Type: application/json');

// 允许跨域请求（根据实际情况调整）
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// 数据库配置
$db_host = 'localhost';      // 数据库主机
$db_user = 'root';           // 数据库用户名
$db_pass = '';               // 数据库密码
$db_name = 'jzzzqjlb_application'; // 数据库名称

// 函数：生成唯一的申请ID
function generateApplicationId() {
    $timestamp = time();
    $random = mt_rand(100, 999);
    return 'APP-' . $timestamp . '-' . $random;
}

// 函数：从足球经历中提取踢球年限
function extractExperienceYears($experienceText) {
    if (preg_match('/(\d+)年/', $experienceText, $matches)) {
        return $matches[1] . '年';
    }
    return '未明确';
}

// 函数：计算每周可训练天数
function countTrainingDays($availabilityText) {
    $daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    $count = 0;
    
    foreach ($daysOfWeek as $day) {
        if (strpos($availabilityText, $day) !== false) {
            $count++;
        }
    }
    
    return $count;
}

// 函数：验证表单数据
function validateFormData($data) {
    $errors = [];
    
    // 验证必填字段
    if (empty(trim($data['fullName']))) {
        $errors['fullName'] = '请输入您的姓名';
    }
    
    if (empty($data['age']) || $data['age'] < 16 || $data['age'] > 60) {
        $errors['age'] = '请输入有效的年龄（16-60岁）';
    }
    
    if (empty($data['gender'])) {
        $errors['gender'] = '请选择性别';
    }
    
    if (empty($data['phone']) || !preg_match('/^1[3-9]\d{9}$/', $data['phone'])) {
        $errors['phone'] = '请输入有效的手机号码';
    }
    
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = '请输入有效的邮箱地址';
    }
    
    if (empty($data['footballExperience']) || strlen($data['footballExperience']) < 10) {
        $errors['footballExperience'] = '请详细描述您的足球经历';
    }
    
    if (empty($data['preferredPosition'])) {
        $errors['preferredPosition'] = '请选择您擅长的位置';
    }
    
    if (empty($data['skillLevel'])) {
        $errors['skillLevel'] = '请评估您的球技水平';
    }
    
    if (empty($data['availability'])) {
        $errors['availability'] = '请说明您可参加训练的时间';
    }
    
    if (!isset($data['privacyAgree']) || $data['privacyAgree'] !== 'on') {
        $errors['privacyAgree'] = '请同意隐私政策以提交申请';
    }
    
    return $errors;
}

// 主处理逻辑
function processApplication() {
    global $db_host, $db_user, $db_pass, $db_name;
    
    // 检查请求方法是否为POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        return [
            'success' => false,
            'message' => '只允许POST请求'
        ];
    }
    
    // 获取表单数据
    $formData = [
        'fullName' => $_POST['fullName'] ?? '',
        'age' => intval($_POST['age'] ?? 0),
        'gender' => $_POST['gender'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'email' => $_POST['email'] ?? '',
        'footballExperience' => $_POST['footballExperience'] ?? '',
        'preferredPosition' => $_POST['preferredPosition'] ?? '',
        'skillLevel' => $_POST['skillLevel'] ?? '',
        'availability' => $_POST['availability'] ?? '',
        'additionalInfo' => $_POST['additionalInfo'] ?? '',
        'privacyAgree' => $_POST['privacyAgree'] ?? ''
    ];
    
    // 验证表单数据
    $validationErrors = validateFormData($formData);
    if (!empty($validationErrors)) {
        return [
            'success' => false,
            'message' => '表单验证失败',
            'errors' => $validationErrors
        ];
    }
    
    // 准备要插入数据库的数据
    $applicationData = [
        'application_id' => generateApplicationId(),
        'name' => trim($formData['fullName']),
        'age' => $formData['age'],
        'gender' => $formData['gender'],
        'phone' => trim($formData['phone']),
        'email' => !empty($formData['email']) ? trim($formData['email']) : null,
        'experience_years' => extractExperienceYears($formData['footballExperience']),
        'experience_description' => trim($formData['footballExperience']),
        'preferred_position' => $formData['preferredPosition'],
        'skill_level' => $formData['skillLevel'],
        'competition_experience' => (strpos(strtolower($formData['footballExperience']), '比赛') !== false || 
                                    strpos(strtolower($formData['footballExperience']), '联赛') !== false) ? 1 : 0,
        'available_times' => trim($formData['availability']),
        'training_frequency' => countTrainingDays($formData['availability']),
        'self_introduction' => !empty($formData['additionalInfo']) ? trim($formData['additionalInfo']) : null,
        'timestamp' => date('Y-m-d H:i:s'),
        'status' => 'pending'
    ];
    
    try {
        // 连接数据库
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // 准备插入语句
        $sql = "INSERT INTO player_applications (
            application_id, name, age, gender, phone, email, 
            experience_years, experience_description, 
            preferred_position, skill_level, competition_experience, 
            available_times, training_frequency, 
            self_introduction, timestamp, status
        ) VALUES (
            :application_id, :name, :age, :gender, :phone, :email, 
            :experience_years, :experience_description, 
            :preferred_position, :skill_level, :competition_experience, 
            :available_times, :training_frequency, 
            :self_introduction, :timestamp, :status
        )";
        
        $stmt = $pdo->prepare($sql);
        
        // 绑定参数
        $stmt->bindParam(':application_id', $applicationData['application_id']);
        $stmt->bindParam(':name', $applicationData['name']);
        $stmt->bindParam(':age', $applicationData['age'], PDO::PARAM_INT);
        $stmt->bindParam(':gender', $applicationData['gender']);
        $stmt->bindParam(':phone', $applicationData['phone']);
        $stmt->bindParam(':email', $applicationData['email']);
        $stmt->bindParam(':experience_years', $applicationData['experience_years']);
        $stmt->bindParam(':experience_description', $applicationData['experience_description']);
        $stmt->bindParam(':preferred_position', $applicationData['preferred_position']);
        $stmt->bindParam(':skill_level', $applicationData['skill_level']);
        $stmt->bindParam(':competition_experience', $applicationData['competition_experience'], PDO::PARAM_INT);
        $stmt->bindParam(':available_times', $applicationData['available_times']);
        $stmt->bindParam(':training_frequency', $applicationData['training_frequency'], PDO::PARAM_INT);
        $stmt->bindParam(':self_introduction', $applicationData['self_introduction']);
        $stmt->bindParam(':timestamp', $applicationData['timestamp']);
        $stmt->bindParam(':status', $applicationData['status']);
        
        // 执行插入
        $stmt->execute();
        
        // 记录操作日志
        $log_sql = "INSERT INTO application_logs (application_id, action_type, action_by, details) 
                    VALUES (:application_id, 'submission', 'system', '申请成功提交')";
        $log_stmt = $pdo->prepare($log_sql);
        $log_stmt->bindParam(':application_id', $applicationData['application_id']);
        $log_stmt->execute();
        
        // 返回成功响应
        return [
            'success' => true,
            'message' => '申请已提交成功！我们将在3个工作日内与您联系。',
            'application_id' => $applicationData['application_id']
        ];
        
    } catch (PDOException $e) {
        // 记录错误日志（实际应用中应使用专业日志系统）
        error_log('Database Error: ' . $e->getMessage());
        
        return [
            'success' => false,
            'message' => '提交失败，请稍后重试',
            'error_details' => $e->getMessage()
        ];
    } catch (Exception $e) {
        // 记录其他错误
        error_log('Application Error: ' . $e->getMessage());
        
        return [
            'success' => false,
            'message' => '系统异常，请稍后重试',
            'error_details' => $e->getMessage()
        ];
    }
}

// 执行处理并返回JSON响应
$response = processApplication();
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>