
//var raw = [{},{},{}];

var SearchModule = {};
(function() {
	var _result = raw;
	var _output;
	var _tables = {"id": {}};
	var _self;
	
	this.construct = function() {
		_self = this;
		return this;
	}

	this.search = function() {
		var data = $.ajax({
			"type": "get",
			"data": data.stringify(), //
			"success": template()
		})
	}
	
	this.formatData = function(received_data) {
		var decodedData = this.handleData(received_data); //parseInt(raw[0]["PAGE_TOTAL"] and "PAGE_CURRENT")
		if (!decodedData.getStatus()) {
			return OutCome.create(false, decodedData.getCode(), decodedData.getBody(), decodedData.getInfo());
		} else {
			_result = decodedData;
			var temp_output;
			$.each(_result, function(k,v) {
				
			})
		}
	}

	this.updateTable = function(data_raw, table_object) {
		var temp_table_id = (table_object instanceof jQuery ? table_object.prop("id") : $(table_object).prop("id"));
		console.log(temp_table_id);
		var this_table = $("table#"+temp_table_id);
		var this_tbody = $(this_table.find("tbody"));
		//var this_table_rows = this_table.find("tbody tr");
		var this_table_column_count = _tables["id"][temp_table_id]["headers"].length;
		//var temp_table_row_count = this_table_rows.length;
		var temp_data_raw_count = data_raw.length;
		var temp_output_tbody = (this_tbody.clone()).html("");
		if (temp_data_raw_count < 1) {
			//temp_output_tbody.append($('<tr>').html($("<td colspan="+this_table_column_count+" style=\"text-align: center\">").html("No entries found")));
			temp_output_tbody.append($('<tr>').html($("<td>")));
		} else {
			for (var i_rows = 0; i_rows < temp_data_raw_count; i_rows++) {
				var this_row = data_raw[i_rows];
				//var temp_cell_index = 0;
				var temp_output_row = $("<tr>");
				//var temp_output_row = $("table#"+temp_table_id+" tbody tr[data-row_index="+i_rows+"]");
				//var temp_output_cells = temp_output_row.find("td");
				//var temp_output_cells;

				
				for(var i_columns = 0; i_columns < this_table_column_count; i_columns++) {
					
					var this_column = _tables["id"][temp_table_id].headers[i_columns];
					var this_column_name = this_column.column_index;
					var temp_cell_data = this_row[this_column_name];
					if (typeof temp_cell_data !== "undefined") {
						var temp_output_cell;
						if (this_column.link === true) {
							temp_output_cell = '<a href="'+this_column.link_URI+this_row[this_column.link_index]+'">'+temp_cell_data+'</a>';
						} else {
							temp_output_cell = temp_cell_data;
						}
						temp_output_row.append($("<td>").html(temp_output_cell));
					}
				}
				temp_output_tbody.append(temp_output_row);
			}
	}
		//Insert data check if empty		
		if (temp_output_tbody[0].innerText === "") {
			temp_output_tbody.html($('<tr>').html($("<td colspan="+this_table_column_count+" style=\"text-align: center\">").html("No entries found")));
		}
		this_tbody.replaceWith(temp_output_tbody);


			// $.each(this_row, function(cell_key, cell_data) {
			// 	console.log(cell_key+" "+cell_data);
			// 	if (cell_key === _tables["id"][temp_table_id]["headers"][temp_cell_index].column_index) {
			// 		if (_tables["id"][temp_table_id].headers[temp_cell_index].link === true) {
			// 			cell_data = '<a href="'+_tables["id"][temp_table_id].headers[temp_cell_index].link_URI+this_row[_tables["id"][temp_table_id].headers[temp_cell_index].link_index]+'">'+cell_data+'</a>';
			// 		} 
			// 		// if (typeof temp_output_cells[temp_cell_index] === undefined) {

			// 		// }
			// 		temp_output_row.append($("<td>").html(cell_data));	
			// 	}
			// 	temp_cell_index++;
			// }) 
			//temp_output_row.append(temp_output_cells);
			// this_tbody.html(temp_output_row);
		//}
		
	}

	this.configure = function() {
		_tables._raw_objects = $("table.activeSearch_table");
		for (var i_tables = 0; i_tables < _tables._raw_objects.length; i_tables++) {
			var this_table = $(_tables._raw_objects[i_tables]);
			if (this_table.prop("id") == "") {
				var temp_table_id = "AS_t"+i_tables;
				temp_table_id = this.incrementID(temp_table_id);
				this_table.prop("id", temp_table_id);
			} else {
				var temp_table_id = this_table.prop("id");
			}
			_tables["id"][temp_table_id] = {};
			_tables["id"][temp_table_id]["DOM_object"] = this_table;
			_tables["id"][temp_table_id]["id"] = temp_table_id;
			_tables["id"][temp_table_id]["page_number"] =  this_table.data("page_number");
			_tables["id"][temp_table_id]["search_URI"] = this_table.data("search_uri");
			_tables["id"][temp_table_id]["rows"] = this_table.find("tbody tr");
			_tables["id"][temp_table_id]["headers"] = ""; //assigned value on 132
			_tables["id"][temp_table_id]["paginations"] = "";

			var temp_headers_cache = this_table.find("thead > tr > td");
			var temp_headers_output = Array();
			var temp_rows_count = _tables["id"][temp_table_id]["rows"].length;
			var temp_form_cache = this_table.parent().find("form.activeSearch_form");
			var temp_pagination_cache = this_table.parent().find(".activeSearch_pagination");
			var temp_pagination_output = Array();

			for (var i_headers = 0; i_headers < temp_headers_cache.length; i_headers++) {
					var this_header = $(temp_headers_cache[i_headers]);
					temp_headers_output.push(this.configureHeader(this_header));
			}

			_tables["id"][temp_table_id]["headers"] = temp_headers_output;
			for (var i_rows = 0; i_rows < temp_rows_count; i_rows++) {
				$(_tables["id"][temp_table_id]["rows"][i_rows]).attr("data-row_index", i_rows);
			}

			for (var i_forms = 0; i_forms < temp_form_cache.length; i_forms++) {
				var this_form = $(temp_form_cache[i_forms]);
				var temp_conf_output = this.configureForm(this_form,this_table,i_forms);
			}
			_tables["id"][temp_table_id]["forms"] = temp_form_cache;

			if (temp_pagination_cache.length < 1) {
				var temp_this_pagination_output = this.configurePages(_tables["id"][temp_table_id],temp_table_id+"p0", _result[0].PAGE_TOTAL, _tables["id"][temp_table_id].page_number);
				if (temp_this_pagination_output !== false) {
					temp_pagination_output.push(temp_this_pagination_output);
				}
			} else {
				for (var i_pagination = 0; i_pagination < temp_pagination_cache.length; i_pagination++) {
					var this_pagination = $(temp_pagination_cache[i_pagination]);
					if (this_pagination.prop("id") == "") {
						var temp_pagination_id = this.incrementID(temp_table_id+"p"+i_pagination);
						this_pagination.prop("id", temp_pagination_id);
						
					}
					var temp_this_pagination_output = this.configurePages(_tables["id"][temp_table_id],this_pagination.prop("id"), _result[0].PAGE_TOTAL, _tables["id"][temp_table_id].page_number);
					if (temp_this_pagination_output !== false) {
						temp_pagination_output.push(temp_this_pagination_output);
					}
				}
			}
			_tables["id"][temp_table_id]["paginations"] = temp_pagination_output;
		}
		console.log(_tables);
	}

	this.configureHeader = function(input_header_jquery) {
		var temp_header_output = {"column_index": input_header_jquery.data("column_index"), "link": input_header_jquery.data("link"), "link_URI": input_header_jquery.data("link_uri"), "link_index": input_header_jquery.data("link_index")};
		return temp_header_output;
	}

	this.configureForm = function(input_form_jquery, input_table_root, input_form_number) {
		if (typeof(input_form_jquery) === "undefined") {
			return false;
		}
		if (typeof(input_table_root) === "undefined") {
			return false;
		}
		var temp_table_id = input_table_root.id;
		if (input_form_jquery.prop("id") == "") {
			var temp_form_id = temp_table_id+"f"+input_form_number;
			temp_form_id = this.incrementID(temp_form_id);
			input_form_jquery.prop("id", temp_form_id);
		} else {
			var temp_form_id = input_form_jquery.prop("id");
		}
		var temp_form_table_id = input_form_jquery.data("table_index");
		if (typeof(temp_form_table_id) === "undefined") {
			input_form_jquery.data("table_index", input_table_root);
		} else {
			input_form_jquery.data("table_index", $("#"+temp_form_table_id));
		}
		input_form_jquery.on("submit", function(e) {
			e.preventDefault();
			_self.updateTable(raw[1],$(this).data("table_index"));
		});
		return input_form_jquery;
	}

	this.configurePages = function(input_table_root, input_pagination_id,input_pages_total, input_pages_current) {
		if (input_table_root.search_URI == "" || typeof(input_table_root.search_URI) == "undefined") {
			return false;
		}
		var this_table = input_table_root;
		var temp_pagination_output_status = true;
		var temp_pagination_output = $(this_table.DOM_object.find("#"+input_pagination_id));
		if (temp_pagination_output.length < 1) {
			temp_pagination_output_status = false; //element does not exist
			var temp_pagination_id = this.incrementID(input_pagination_id);
			var temp_pagination_output = $("<div>").prop("id", temp_pagination_id);
		}
		temp_pagination_output.html("");
		for (var i_pages = 1; i_pages <= input_pages_total; i_pages++) {
			var temp_page_object = $("<a>").prop("href",this_table.search_URI+"?page="+(i_pages)).html(i_pages);
			if (i_pages == input_pages_current) {
				temp_page_object.addClass("activeSearch_pagination_current");
			}
			temp_pagination_output.append(temp_page_object);
		}
		if (input_pages_current != 1) {
			temp_pagination_output.prepend($("<a>").prop("href", this_table.search_URI+"?page="+(input_pages_current-1)).html("<"))
		}
		if (input_pages_current != input_pages_total) {
			temp_pagination_output.append($("<a>").prop("href", this_table.search_URI+"?page="+(input_pages_current+1)).html(">"))
		}
		if (!temp_pagination_output_status) {
		this_table.DOM_object.after(temp_pagination_output);
		}
		return temp_pagination_output;
	}
	
	this.incrementID = function(input_increment_id) {
		if ($("#"+input_increment_id).length !== 0) {
			var temp_input_numbers = input_increment_id.match(/\d+/g);
			if (temp_input_numbers !== null) {
				var temp_input_numbers_last = (temp_input_numbers.length -1);
				temp_input_numbers = temp_input_numbers.map(Number)[temp_input_numbers_last];
				var temp_increment_id = input_increment_id.split(temp_input_numbers)[0]+(temp_input_numbers+1);
			} else {
				temp_increment_id = input_increment_id+"0"
			}
			return this.incrementID(temp_increment_id);
		} else {
			return input_increment_id;
		}
	}
}).apply(SearchModule);