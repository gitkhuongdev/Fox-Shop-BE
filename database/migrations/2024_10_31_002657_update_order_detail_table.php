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
        {
            Schema::table('order_details', function (Blueprint $table) {
           $table->dropForeign('order_details_id_attribute_foreign');
            $table->dropColumn('id_attribute');
            if(!Schema::hasColumn('order_details','color')){
                   $table->string('color')->after('id_product')->nullable();
            }
            if (!Schema::hasColumn('order_details', 'size')) {
                $table->string('size')->after('color')->nullable();
            }
        });
    }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
