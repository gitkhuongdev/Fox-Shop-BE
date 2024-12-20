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
        Schema::table('order_details', function (Blueprint $table) {
            $table->string('image')->nullable()->after('total_money'); // Thêm cột image, có thể null
        });
    }
    
    public function down()
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropColumn('image'); // Xóa cột image nếu rollback
        });
    }
    
};
