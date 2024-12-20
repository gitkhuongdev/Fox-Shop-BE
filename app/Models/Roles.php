<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;
    protected $table='roles';
    protected $fillable=['id','name','guard_name','created_at','updated_at'];
    public function users(){
        return $this->hasMany(User::class);
    }
    // public function scopeActive(Builder $query){
    //     return $query->where('status',1);
    // }
}
