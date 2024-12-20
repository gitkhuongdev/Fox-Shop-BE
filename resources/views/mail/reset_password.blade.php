<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 2rem auto;
            padding: 20px;
            background-color: #fff;+
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #FF9900;
            text-align: center;
        }
        p {
            margin: 10px 0;
        }
        .reset-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
            color: #fff;
            
        }
        .reset-link:hover {
            background-color: #0056b3;
            color:#fff;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Đặt lại mật khẩu</h1>
        <p>Xin chào {{ $data['name'] }},</p>
        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.
             Nhấp vào liên kết bên dưới để đặt lại mật khẩu:</p>
        <a class="reset-link" href="{{ $data['reset_link'] }}">Đặt lại mật khẩu</a>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <div class="footer">Cảm ơn bạn!</div>
    </div>
</body>
</html>