$(document).ready(function(){
	var tagsinputs = $('input[data-role="tagsinput"]');
	if (tagsinputs){
		createTagsInput(tagsinputs);
		addEventHandlerOnTagsInput($("div.my-tagsinput"));
	}
});

function createTagsInput(inputs){
	inputs.css('display','none');
	$('<div class="my-tagsinput"><input type="text" placeholder="tag" style="width: 3em;" size="1"/></div>').insertAfter(inputs);
}

function addEventHandlerOnTagsInput(tagsinputs){
	// ADD THE TAG TO TAGS LIST
	tagsinputs.children('input[type="text"]').keyup(function(e){
		// Check the key pressed ([13 -> ENTER, 27 -> SPACEBAR])
		if (jQuery.inArray(e.which, [13,32]) != -1 && $(this).val() != ''){
			// Add the tag after checking the value and refresh the display if it was successfully added
			if( addTagToTagsInput($(this).val(), $(this).parent()) ){
				refreshTagInputDisplay($(this).parent());
			}
		}
	});

	// Focus event
	tagsinputs.click(function(e){
		$(e.target).children('input[type="text"]').focus();
	});

	// INPUT LENGTH AND CHECKING
	tagsinputs.children('input[type="text"]').on('input', function(e){
		// If a non recognized character is entered, we delete it
		$(this).val(checkString($(this).val()));
		// We adapt the input size
		if ($(e.target).val().length > 3)
			$(e.target).css('width', $(e.target).val().length+'em');
		else
			$(e.target).css('width', '3em');
	});
}

function checkString(string){
	return string.replace(/[\W_]+/g,'');;
}

function addTagToTagsInput(tagvalue, tagsinput){
	// We check if the value is already contained in the input
	var tagsInInput = tagsinput.val() || [];
	console.log(tagsInInput);
	if(jQuery.inArray(tagvalue, tagsInInput) == -1){
		// If not, we can add the value
		tagsInInput.push(tagvalue);
		tagsinput.val(tagsInInput);
		return true;
	}
	// If the tag is already container, we highlight it for 0.5s
	else{
		tagsinput.children('input').val('');
		tagsinput.children('.tag[name="'+tagvalue+'"]').each(function(){
			highlightTag($(this), 100)
		});
		// highlightTag(, 500);
		return false;
	}
}

function highlightTag(tag, time){
	tag.css('background-color', '#F7D358');
    setTimeout(function() {
        tag.css('background-color', '');
    }, time);
}

function refreshTagInputDisplay(tagsinput){
	// Get each tag value
	var tagsInInput = tagsinput.val() || [];
	// Reset the display
	tagsinput.children('.tag').remove();
	tagsinput.children('input').val('');
	tagsinput.children('input').css('width', '3em');
	// Add each tag
	for(var i = 0; i < tagsInInput.length; i++){
		$('<span class="tag" name="'+tagsInInput[i]+'">'+tagsInInput[i]+'<span class="remove">x</span></span>').insertBefore(tagsinput.children('input[type="text"]'));
	}
	// Set remove handler
	tagsinput.find('.remove').click(function(e){
		var tag = $(e.target).parent();
		removeTagFromTagsInput(tag, tag.parent());
	});
}

function removeTagFromTagsInput(tag, tagsinput){
	// Remove from tagsinput values
	var tagsInInput = tagsinput.val() || [];
	var tagIndex = jQuery.inArray(tag.attr('name'), tagsInInput);
	if (tagIndex != -1){
		tagsInInput.splice(tagIndex, 1);		
	}
	tagsinput.val(tagsInInput);
	// Remove the element
	tag.remove();
}