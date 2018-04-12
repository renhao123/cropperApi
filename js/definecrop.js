$("body").append("<div class='modal fade' id='crop' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header' style='padding-top: 10px; padding-bottom: 10px;'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h5 class='modal-title'>截取图片尺寸：</h5></div><div class='modal-body text-center pl0 pr0' style='padding-left: 0px; padding-right: 0px;'></div><div class='modal-footer' style='padding-top: 10px; padding-bottom: 10px;'><button type='button' class='btn btn-default' onclick='bingInput()'>选择图片</button><button type='button' class='btn btn-default cancleBtn' data-dismiss='modal'>取消</button><button type='button' class='btn btn-primary surebtn'>确定</button></div></div></div></div>");

//  上传照片
function uploadPic(x, y, ts){
	// 清楚上次操作残留信息
	$("#crop .modal-body").html("<input type='file' class='dp-none' accept='image/gif,image/png,image/jpg,image/jpeg' /><img src='img/jia.png' />");
	// 显示截取图片弹出框
	$("#crop").modal("show");
	//触发input type=file,打开本地文件夹
	$("#crop input").click();
	//在文件夹中选取图片，放入cropper截取框内
	cropPic(x, y, ts);
};

//   在应该放置图片的位置,放入input file选择的文件
function cropPic(x, y, ts) {
	//  规定图片类型
  	var imageType = /image.*/;
  	//  防止变量提升无法调用函数，在回掉中开始截图
	var getOnloadFunc = function(aImg) {
		return function(e) {
	  		aImg.src = e.target.result;
	  		beginShot(x, y, ts);
		};
	};
	
	$("#crop input").off("input propertychange change").on("input propertychange change", function (e) {
	  	for(var i = 0, numFiles = this.files.length; i < numFiles; i++) {
	      	var file = this.files[i];
	      	if(!file.type.match (imageType)) {continue;};
	      	// 创建img标签
	      	var newImg = document.createElement("img");
	      	// 去掉原有的图片，插入input type=file, 下次可再使用
	      	$("#crop .modal-body").html("<input type='file' class='dp-none' accept='image/gif,image/png,image/jpg,image/jpeg' />")
	      	// 插入最终截取的图片
	      	$("#crop .modal-body").append(newImg);
	      	//  给被截取的图片加上ID,方便下一步的初始化
	      	$("#crop .modal-body img").attr("id", "shotImg");
	      	var reader = new FileReader();
	      	reader.onload = getOnloadFunc(newImg);
	      	reader.readAsDataURL(file);
	    }
	})
};

//cropper
function beginShot(x, y, ts) {
	//  1,初始化,开始挂载
	var shotImg = document.getElementById('shotImg');
	var cropper = new Cropper(shotImg, {
		aspectRatio: x / y, //  crop比例
		dragMode: 'none', //  拖动模式，不重新建立crop，不允许拖动画布
		ready: function() { //  挂载方法,真正的保存,转换格式,在这里进行
			var _this = this.cropper; //  定义当前实例变量  
			
			function shortcanvas() { //  截图保存为canvas
				return _this.getCroppedCanvas({
					// 设置保存的图片的宽高
					// width: 160,
					// height: 90,
					beforeDrawImage: function(canvas) {
						var context = canvas.getContext('2d');
						context.imageSmoothingEnabled = false;
						context.imageSmoothingQuality = 'high';
					}
				})
			};
			
			//  保存的canvas截图转换为常规的img
			function convertCanvasToImage(canvas) {
				var image = new Image();
				image.src = canvas.toDataURL('image/jpeg');
				return image;
			};

			$("#crop .surebtn").off("click").on("click", function () {
				$(ts).html(convertCanvasToImage(shortcanvas()));
				$("#crop").modal("hide");
			});
		}
	})
};

// crop弹出框内绑定
function bingInput () {
	$("#crop input").click();
}