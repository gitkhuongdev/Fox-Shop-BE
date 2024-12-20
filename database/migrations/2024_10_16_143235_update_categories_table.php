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
      if (Schema::hasTable('categories')) {
        Schema::table('categories', function (Blueprint $table) {
            if(!Schema::hasColumn('categories','images')){
                $table->string('images',255)->after('slug')->nullable();
            }
        });
      }
    }
    public function down(): void
    {
    }
};
