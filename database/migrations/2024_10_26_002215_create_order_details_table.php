<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
           $table->id(); // Primary Key
            $table->foreignId('id_product')->constrained('products'); // Khóa ngoại liên kết với bảng products
            $table->foreignId('id_attribute')->constrained('products_attribute'); // Khóa ngoại liên kết với bảng product_attributes
            $table->foreignId('id_order')->constrained('orders'); // Khóa ngoại liên kết với bảng orders
            $table->integer('quantity'); // Số lượng sản phẩm
            $table->decimal('total_money', 10, 2); // Tổng tiền
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
