function getObjectProperty(o, index)
{
  for(var i in o )
  {
   if( index == 0 )
    return i;
   index--;
  }
  return null;
}

function filterObjectProperties(o, filter, index)
{
  if( !index ) index = 0;
  var obj = {};
  for( var i in o )
  {
    var p = getObjectProperty(o[i],index);
    if(filter.indexOf(p))
    {
      if( !obj[p] )
        obj[p] = [];
      
      obj[p].push(o[i][p]);
    }
  }
  return obj;
}

var xb = {
  dim: function(n) {
    if( window['innerWidth'] ) {
      return [window.innerWidth,window.innerHeight];
    } else if( document.documentElement && (document.documentElement.clientWidth) ) {
      return [document.documentElement.clientWidth, document.documentElement.clientHeight];
    } else if( document.body && (document.body.clientWidth) ) {
      return [document.body.clientWidth, document.body.clientHeight];
    }
  },
  bind: function(o,t,f,b) {
    b = b || false;
    if(o.addEventListener) {
      o.addEventListener(t, f, b);
    } else if(o.attachEvent) {
      o.attachEvent( "on"+t, f );
    }
  },
  unbind: function(o,t,f,b) {
    b = b || false;
    if(o.removeEventListener) {
      o.removeEventListener(t, f, b);
    } else if(o.detachEvent) {
      o.detachEvent( "on"+t, f );
    }
  },
  target: function (e){ e = e || window.event;  return e.currentTarget || window.event.srcElement; },
  cancel: function(e) {
    if( e.stopPropagation ){ e.stopPropagation(); e.preventDefault(); }
    else{ window.event.cancelBubble = true; }
  }
};

var MelaMeta = {
 context: null,
 _position: null,
 
 position: function(x,y) {
  this._position = [x,y];
 },
 
 container: function(o)
 {
  var id = "meta-" + o.context.type + o.context.id;
  var odiv = $(id);
  var win = xb.dim();
  if( odiv )
  {
    odiv.style.visibility = "visible";
    odiv.style.top = ((this._position[1] - 10) + (window.pageYOffset || document.documentElement.scrollTop)) + "px";
		if( win[0]/2 < this._position[0] ) {
			odiv.style.left = (this._position[0] - 410) + "px";	
		} else {
			odiv.style.left = (this._position[0] - 10) + "px";
		}
    MelaMeta.divTimeout(odiv,true);
  }
  else
  {
    var atags = document.body.getElementsByTagName('a');
    for(var i in atags)
    {
      if( atags[i]['rel'] == 'melative' )
      {
       if( unescape(atags[i].href.replace(/http:\/\/melative\.com/,"").replace(/\+/g," ")) == ("/"+o.context.type+"/"+o.context.name) )
       {
       atags[i]['cid'] = id;
       }
      }
    }
    
    odiv = document.createElement('div');
    odiv.id = id;
    odiv.className = "mcontext-div";
    odiv.style.top = ((this._position[1] - 10) + (window.pageYOffset || document.documentElement.scrollTop)) + "px";
		if( win[0]/2 < this._position[0] ) {
			odiv.style.left = (this._position[0] - 410) + "px";	
		} else {
			odiv.style.left = (this._position[0] - 10) + "px";
		}
    
    var html = "<img src=\"http://images.melative.com" + o.context.image + "_120.jpg\" />";
    html += "<h2><a href=\"http://melative.com/" + o.context.type + "/" + o.context.name +"\">" + o.context.name + "</a></h2> ";
    html += '<div class="cd"> ';
    
    var basic = {};
    if( o['base'] )
    {
      for(var i in o.base )
      {
        var fp = getObjectProperty(o.base[i],0);
        if( !basic[fp] )
          basic[fp] = o.base[i][fp];
      }
      
      if( basic['first'] )
      {
        html += '<small>(' + basic['first'];
        var bf = ['season','format','type'];
        for( var i in bf )
        {
          if( basic[ bf[i] ] )
          {
            var v = basic[ bf[i] ];
            html += ', ' + v.substr(0,1).toUpperCase() + v.substring(1);
          }
        }
        html += ')</small>';
      }
    }
    
    if( o['production'] )
    {
      var production = filterObjectProperties( o['production'], "|creator,director,studio,composition,artist,label,mangaka,author|" );
      var phtml;
      var pfield = ['creator','mangaka','artist','author','director','studio','composition','label'];
      
      for( var p in pfield  )
      {
        var i = pfield[p];
        if( !production[ i ] ) continue;
        
        phtml = ' <span><strong>' + i.substring(0,1).toUpperCase() + i.substring(1) + (production[i].length>1? 's' :  '') + ':</strong> ';
        phtml += production[i].toString() + '</span>';
        html += phtml;
      }
    }
    
    if( o['resources'] )
    {
      var R = o.resources;
      var rhtml = "";
      rhtml += ' <span><strong>Resources:</strong> ';
      for( var i in R )
      {
        rhtml += '<a href="' + R[i].url + '"' + (R[i]['note'] ? ' title="' + R[i]['note'] + '"': "") + '>' + R[i].title + '</a>, ';
      }
      rhtml = rhtml.substring(1,rhtml.lastIndexOf(',')) + '</span> ';
      html += rhtml;
    }
    
    
    if( o['description'] )
    {
      html += '<p>' + o.description + '</p>';
    }
    
    html += '</div>';
    odiv.innerHTML = html;
    
    odiv = document.body.appendChild(odiv);
    
    xb.bind(odiv, 'mouseover', MelaMeta.divOver, false);
    xb.bind(odiv, 'mouseout', MelaMeta.divOut, false);
  }
 },

 listener: function()
 {
  var atags = document.body.getElementsByTagName('a');
  for(var i in atags)
  {
    if( atags[i]['rel'] == 'melative' )
    {
      xb.bind(atags[i], 'mouseover', MelaMeta.over, false);
    }
  }
 },
 
 over: function(e)
 {
  var e = e || window.event;
  var tar = xb.target(e);
  
  xb.unbind(tar, "mouseover", MelaMeta.over, false);
  xb.bind(tar, "mouseout", MelaMeta.out, false);
  MelaMeta.position(e.clientX, e.clientY);
  
  	if ( tar.tagName == 'IMG' || tar.tagName == 'DIV' )
	{
		var mar = xb.target(e).parentNode.href;
		var data = /http:\/\/melative.com\/(\w+)\/(.+)/.exec(mar);
	}
	else
	{
		var data = /http:\/\/melative.com\/(\w+)\/(.+)/.exec(tar);
	}
  
  MelaMeta.inject( "http://melative.com/api/media.meta.json?callback=MelaMeta.callback&cache=1800&" + data[1] + "=" + data[2] );
 },
 
 out: function(e)
 {
  var tar = xb.target(e);
  xb.unbind(tar, "mouseout", MelaMeta.out, false);
  xb.bind(tar, "mouseover", MelaMeta.over, false);
  MelaMeta.divTimeout( $( tar['cid'] ) );
 },
 
 divOver: function(e)
 {
  MelaMeta.divTimeout(xb.target(e),true);
 },
 
 divOut: function(e)
 {
  MelaMeta.divTimeout(xb.target(e));
 },
 
 divTimeout: function(d,clear)
 {
  if( clear )
  {
    if( d['timeout'] )
    {
      window.clearTimeout(d.timeout);
      d['timeout'] = null;
    }
  }
  else if( d )
  {
    d['timeout'] = window.setTimeout(function(){ d.style.visibility = "hidden";}, 50);
  }
 },
 
 inject: function(href)
 {
  var script = $('mela-meta-script');
  if( script )
  {
    var p = script.parentNode;
    p.removeChild(script);
  }
  
  script = document.createElement('script');
  script.type = "text/javascript";
  script.src = href;
  document.body.appendChild(script);
 },
 
 callback: function(o)
 {
  MelaMeta.context = o.context;
  MelaMeta.container(o);
 }
}

xb.bind(window, 'load', MelaMeta.listener, false);

var Events = {
"currentHandlers":{},
"create": function (obj,type,fn,bubble){
  if(obj.addEventListener){
    obj.addEventListener(type, fn, bubble);
  } else if(obj.attachEvent){
    obj["e"+type+fn] = fn;
    obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
    obj.attachEvent( "on"+type, obj[type+fn] );
  }
},
"remove": function (obj,type,fn,bubble){
  if(obj.removeEventListener){
    obj.removeEventListener(type,fn,bubble);
  } else if(obj.detachEvent){
    obj.detachEvent( "on"+type, obj[type+fn] );
    obj[type+fn] = null;
    obj["e"+type+fn] = null;
  }
},
"target": function (e){ e = e || window.event;  return e.currentTarget || e.srcElement; },
"assignOwnership": function(id,obj){ Events.currentHandlers[id] = obj; },
"disablePropagation": function(e){
  if( e.stopPropagation ){ e.stopPropagation(); e.preventDefault(); }
  else{ window.event.cancelBubble = true; }
}
};

function $(id){ return document.getElementById(id); }