<?php
/*
Plugin Name: melative-link
Plugin URI: http://melative.pbworks.com/WordPress
Description: Instant information on any linked Melative title displayed inside a Bubble!
Version: 0.8
Author: RyanA, mellow_bunny
Author URI: http://melative.com
*/

/*  Copyright 2009  RyanA, mellow_bunny  (email : us@melative.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

function melative_init() {
	wp_enqueue_style ('melative-css', '/' . PLUGINDIR . '/melative-link/css/style.css');
	wp_enqueue_script('melative-js', '/' . PLUGINDIR . '/melative-link/js/misc.js');
}    
 
add_action('init', melative_init);

?>
