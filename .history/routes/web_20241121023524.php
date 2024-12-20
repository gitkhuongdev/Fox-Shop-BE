<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MethodController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrdersMngController;
use App\Http\Controllers\VoucherController;
Route::get('/',[UserController::class, 'loginForm']);
Route::prefix('admin')->group(function () {
Route::resource('/roles', RolesController::class);
Route::resource('/permissions', PermissionController::class);
Route::resource('/users', UserController::class);
Route::resource('/categories', CategoriesController::class);
Route::post('/categories/switch/{id}', [CategoriesController::class, 'switchCategories']);
Route::resource('/brands', BrandController::class);
Route::resource('/products', ProductController::class);
Route::post('categories/imgaes/{id}', [CategoriesController::class, 'updateCate']);
Route::post('post/update/{id}', [PostController::class, 'updatePost']);
Route::post('voucher/update/{id}', [VoucherController::class, 'updateVoucher']);
Route::post('method/update/{id}', [MethodController::class, 'updateMethod']);
Route::put('/products/switch/{id}', [ProductController::class, 'switchProduct']);
Route::delete('/products/drop-image/{id}/{imageName}', [ProductController::class, 'removeImage']);
Route::post('/products/set-image/{id}/{imageName}', [ProductController::class, 'setImage']);
Route::post('/products/set-image/{id}/{imageName}', [ProductController::class, 'setImage']);
Route::post('/products/upload-images/{id}', [ProductController::class, 'UploadImages']);
Route::resource('/attributes', AttributeController::class);
Route::resource('/posts', PostController::class);
Route::resource('/vouchers', VoucherController::class);
Route::post('/vouchers/status/{id}', [VoucherController::class, 'UploadStatus']);
Route::post('', [VoucherController::class, 'receiveVoucher'] );
Route::resource('/methods', MethodController::class);
Route::resource('/cart',CartController::class);
Route::resource('/dashboard', DashboardController::class);   
Route::resource('/ordermng', OrdersMngController::class);
Route::get('/products/detail/{slug}', [ProductController::class, 'ProDetail']);
});

