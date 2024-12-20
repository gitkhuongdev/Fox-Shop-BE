<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropColumn(['compare_price', 'color']);
    });
}

public function down()
{
    Schema::table('products', function (Blueprint $table) {
        $table->string('compare_price'); // Kiểu dữ liệu của cột 
        $table->string('color'); // Kiểu dữ liệu của cột
    });
}

};
