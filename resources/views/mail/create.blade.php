<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Box Template</title>
    <style>
        /* Reset CSS */
        body,
        h1,
        p {
            margin: 0;
            padding: 0;
            font-family: 'Times New Roman', Times, serif
        }

        /* Box Container */
        .email-box {
            width: 60%;
            /* 60% width on desktop */
            margin: 0 auto;
            padding: 20px;
            background: #f2f2f2;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        /* Heading */
        .email-box h1 {
            line-height: 40px;
            text-align: center;
            background: aqua;
            color: black;
            margin-bottom: 20px;
            padding: 10px 0;
            border-radius: 5px;
        }

        /* Body Text */
        .email-box p {
            font-size: 16px;
            line-height: 1.5;
        }

        /* Responsive Styles */
        @media screen and (max-width: 767px) {
            .email-box {
                width: 98%;
                /* 98% width on phone */
            }
        }
    </style>
</head>

<body>

    <div class="email-box">
        <h1>Xác minh tài khoản</h1>
        <ul>
            <p>Nếu bạn đã đăng kí tài khoản này với foxshop!</p>
            <P>Vui lòng xác nhận</P>
            <p>Email: {{$data['email']}}</p>
            <a href="{{ url('/verify/' . $data['id'])}}"
                style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #fff; background-color:rgb(197, 53, 53); border-radius: 5px; text-decoration: none; margin-top: 20px;">
                Xác nhận
            </a>
        </ul>
    </div>

</body>

</html>