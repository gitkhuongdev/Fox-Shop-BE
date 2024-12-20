<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;
    protected $table='gallery';
    protected $fillable=[
        'id','id_parent','image','status','created_at','updated_at'	
    ];
}
