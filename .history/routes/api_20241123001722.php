<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VoucherController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

    Route::get('/registerform', [UserController::class, 'registerForm']);
    Route::get('/loginform', [UserController::class, 'loginForm']);
    Route::middleware('auth:sanctum')->get('/info', [UserController::class, 'info']);
    Route::get('/forgot', [UserController::class, 'forgotPassForm']);
    Route::post('/forgot', [UserController::class, 'sendResetLinkEmail']);
    Route::get('/resetpassword/{token}/{email}', [UserController::class, 'resetForm']);
    Route::post('/resetPassword', [UserController::class, 'resetPassword']);
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
    Route::post('/update/user', [UserController::class,'updateUser']);
    Route::post('/payment', [PaymentController::class, 'vnpay_payment']);
    Route::get('/payment/url', [PaymentController::class, 'vnpay_payment_url']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/vnpay-return', [PaymentController::class, 'vnpayreturn'])->name('payment.return');
    Route::post('/vnpay-data', [PaymentController::class, 'vnpay_data']);
    Route::get('/orders/{id_user}', [OrderController::class, 'getOrdersByUserId']);
    Route::get('/orders/{id}', [OrderController::class, 'getOrdersByUserId']);

    Route::resource('/review', ReviewController::class);
Route::prefix('products')->name('products.')->group(function () {
    Route::get('/',[ProductController::class,'api_product']);
    Route::get('/search/{id}',[ProductController::class,'api_search_product']);
    Route::get('/{slug}',[ProductController::class,'apiProductDetail']);
    Route::get('/gallery/{id}',[ProductController::class,'api_gallery_by_product_id']);
    Route::post('/loadCart',[ProductController::class,'api_load_cart_product']);
    Route::get('/products-category/{id}',[ProductController::class,'api_product_cate']);
    Route::get('/details/{slug}',[ProductController::class,'api_product_details']);
});
Route::prefix('categories')->name('categories.')->group(function () {
    Route::get('/',[CategoriesController::class,'api_categories']);
    Route::get('/with-products',[CategoriesController::class,'api_categories_with_products']);
    Route::get('/{slug}',[CategoriesController::class,'api_paginate_products_by_category']);
});
Route::prefix('brands')->name('brands.')->group(function () {
    Route::get('/',[BrandController::class,'api_brands']);
});
Route::prefix('post')->name('post.')->group(function () {
    Route::get('/',[PostController::class,'api_post']);
    Route::get('/{slug}',[PostController::class,'api_post_detail']);
});
Route::prefix('voucher')->name('voucher.')->group(function () {
    Route::post('/',[VoucherController::class,'api_voucher_user']);
    Route::delete('/user_vouchers',[VoucherController::class,'deleteVoucher']);
});
Route::prefix('comment')->name('comment')->group(function () {
    Route::get('/',[ReviewController::class,'getAllComments']);
});