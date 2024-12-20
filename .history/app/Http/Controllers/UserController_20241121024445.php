<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Mail\createUser;
use App\Mail\ResetPasswordMail;
use Inertia\Inertia;


class UserController extends BaseCrudController
{
    protected $model;
    public function __construct()
    {
        $this->model =  User::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = $this->model::with('roles')->get();
        $roles = Roles::all();
        return Inertia::render('User/Index', ['roles' => $roles, 'users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }
    /**
     * Display the specified resource.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'idRole' => 'required|exists:roles,id'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        $password = random_int(10000, 99999);
        $data['password'] = Hash::make($password);
        User::create($data);
        $data = [
            'email' => $request->email,
            'password' => $password,
        ];
        Mail::to($request->email)->send(new createUser($data));
        $users = $this->model::with('roles')->get();
        return response()->json(['check' => true, 'data' => $users]);
    }
    public function register(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|min:2',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&.]/'
            ],
            'phone' => 'required|string|max:10|min:0|regex:/^(0[1-9]{1})([0-9]{8})$/',
            'avatar' => 'nullable|image|max:2048',
        ], [
            // Thông báo lỗi cho 'name'
            'name.required' => 'Vui lòng nhập tên.',
            'name.string' => 'Tên không chứa kí tự số.',
            'name.max' => 'Tên không được quá 255 ký tự.',
            'name.min' => 'Tên phải lớn hơn 2 ký tự.',
        
            // Thông báo lỗi cho 'email'
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'email.max' => 'Email không được quá 255 ký tự.',
            'email.unique' => 'Email đã được sử dụng.',
        
            // Thông báo lỗi cho 'password'
            'password.required' => 'Mật khẩu không được để trống.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.regex' => 'Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.',
        
            // Thông báo lỗi cho 'phone'
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.max' => 'Số điện thoại không được quá 10 ký tự.',
            'phone.min' => 'Số điện thoại sai định dạng.',
            'phone.regex' => 'Số điện thoại không đúng định dạng.',
        
            // Thông báo lỗi cho 'avatar'
            'avatar.image' => 'Ảnh đại diện phải là một tệp hình ảnh.',
            'avatar.max' => 'Ảnh đại diện không được quá 2MB.',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $avatarUrl = Storage::url($avatarPath);
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'avatar' => $avatarUrl,
                'idRole' => 2,
            ]);
        } else {
            $user = User::create([

             'name' => $request->name,
             'email' => $request->email,
             'password' => Hash::make($request->password),
             'phone' => $request->phone,
             'avatar' => "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
             'idRole' => 2,


            ]);
        }
    
        // Gửi email xác nhận
        Mail::to($user->email)->send(new createUser($user));
    
        // Trả về thông báo thành công và thông tin người dùng
        $users = User::with('roles')->where('id', $user->id)->get();
        return response()->json([
            'check' => true,
            'data' => $users,
            'message' => 'Đăng kí tài khoản thành công'
            
        ], 201);
        
    }
    

    public function login(Request $request)
    {
        // Validate các trường dữ liệu trong request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',  
            'password' => 'required|string|min:8',  
        ], [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->toArray()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
    
        if (!$user) {
            return response()->json([
                'errors' => [
                    'email' => ['Email này chưa được đăng ký.']
                ]
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'password' => ['Mật khẩu không chính xác.']
                ]
            ], 401);
        }
    
        $token = $user->createToken('YourAppName')->plainTextToken;
    
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => asset($user->avatar),
                'phone' => $user->phone
            ]
        ], 200);
    }


    public function registerForm()
    {
        return Inertia::render('User/Register');
    }
    public function loginForm()
    {
        return Inertia::render('User/Login');
    }
   
public function logout()
    {
        Auth::logout();
        return redirect('/'); 
    }
    public function getUserInfo()
    {
        $user = Auth::user();
        return response()->json($user);
    }
    public function updateUser(Request $request)
{
    $userId = $request->id;
    $user = User::find($userId);
    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'phone' => 'required|string|max:15|unique:users,phone,' . $user->id,
        'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('avatar')) {
        if ($user->avatar) {
            Storage::delete($user->avatar);
        }

        $avatarPath = $request->file('avatar')->store('avatars', 'public');
        $avatarUrl = Storage::url($avatarPath);
        $validatedData['avatar'] = $avatarUrl;
    }

    // Cập nhật thông tin người dùng
    $user->update($validatedData);

    // Trả về thông tin người dùng đã cập nhật
    return response()->json([
        'message' => 'Cập nhật thông tin thành công.',
        'user' => $user
    ], 200);
}


    public function info()
    {
       return Inertia::render('User/Info');
    }

    public function forgotPassForm()
    {
        return Inertia::render('User/Forgot');
    }




    public function sendResetLinkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $response = Password::sendResetLink($request->only('email'), function ($user, $token) {
        $data = [
            'name' => $user->name,
            'reset_link' => url('https://foxshop.trungthanhzone.com/recover-password/'.$token.'/'.urlencode($user->email)),
        ];
        Mail::to($user->email)->send(new ResetPasswordMail($data));
        });
        if ($response) {
            return response()->json(['message' => 'Vui lòng kiểm tra email để thay đổi mật khẩu.'], 200);
        }
      return response()->json(['error' => 'Không thể gửi liên kết.'], 500);
    }

    public function resetPassword(Request $request)
{
   // Validate the request
    $validator = Validator::make($request->all(), [
        'token' => 'required',
        'password' => 'required|confirmed|min:8', // minimum password length
        'password_confirmation' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Find the user by email using the token
   $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user) use ($request) {
            $user->password = Hash::make($request->password);
            $user->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['status' => 'Mật khẩu đã được cập nhập thành công!'])
        : response()->json(['errors' => ['email' => 'Có lỗi xảy ra.']], 500);
}
public function resetForm($token, $email)
{
    return Inertia::render('User/ResetPass', [
        'token' => $token,
        'email' => $email,
    ]);
}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'email|unique:users,email',
            'idRole' => 'exists:roles,id'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        if ($request->has('status')) {
            $old = User::find($id)->value('status');
            if ($old == 0) {
                $new = 1;
            } else {
                $new = 0;
            }
            $data['status'] = $new;
        }
        User::findOrFail($id)->update($data);
        $users = User::with('roles')->get();
        return response()->json(['check' => true, 'data' => $users]);
    }
  
    public function edit(User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($identifier)
    {
        User::where('id', $identifier)->delete();
        $data = $this->model::with('roles')->get();
        return response()->json(['check' => true, 'data' => $data], 200);
    }
}
