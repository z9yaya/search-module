
var raw = [{},{},{}];

var SearchModule = {};
(function() {
	var _result;
	var _output;
	var _tables = {};
	var _self;
	
	this.construct = function() {
		_self = this;
		return this;
	}

	this.search = function() {
		var data = $.ajax({
			"type": "get",
			"data": data.stringify(),
			"success": template()
		})
	}
	
	this.formatData = function(received_data) {
		var decodedData = this.handleData(received_data);
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
		var this_table_column_count = _tables[temp_table_id]["headers"].length;
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
					
					var this_column = _tables[temp_table_id].headers[i_columns];
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
			// 	if (cell_key === _tables[temp_table_id]["headers"][temp_cell_index].column_index) {
			// 		if (_tables[temp_table_id].headers[temp_cell_index].link === true) {
			// 			cell_data = '<a href="'+_tables[temp_table_id].headers[temp_cell_index].link_URI+this_row[_tables[temp_table_id].headers[temp_cell_index].link_index]+'">'+cell_data+'</a>';
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
		_tables.objects = $("table.activeSearch_table");
		for (var i_tables = 0; i_tables < _tables.objects.length; i_tables++) {
			var this_table = $(_tables.objects[i_tables]);
			if (this_table.prop("id") == "") {
				var temp_table_id = "AS_t"+i_tables;
				this_table.prop("id", temp_table_id);
			} else {
				var temp_table_id = this_table.prop("id");
			}
			_tables[temp_table_id] = {};
			_tables[temp_table_id]["page_number"] =  this_table.data("page_number");
			_tables[temp_table_id]["rows"] = this_table.find("tbody tr");
			var temp_headers_cache = this_table.find("thead > tr > td");
			var temp_headers_output = Array();
			var temp_rows_count = _tables[temp_table_id]["rows"].length;
			var temp_form_cache = this_table.parent().find("form.activeSearch_form");
			for (var i_headers = 0; i_headers < temp_headers_cache.length; i_headers++) {
					var this_header = $(temp_headers_cache[i_headers]);
					temp_headers_output.push({"column_index": this_header.data("column_index"), "link": this_header.data("link"), "link_URI": this_header.data("link_uri"), "link_index": this_header.data("link_index")});
			}
			_tables[temp_table_id]["headers"] = temp_headers_output;
			for (var i_rows = 0; i_rows < temp_rows_count; i_rows++) {
				$(_tables[temp_table_id]["rows"][i_rows]).attr("data-row_index", i_rows);
			}
			for (var i_forms = 0; i_forms < temp_form_cache.length; i_forms++) {
				var this_form = $(temp_form_cache[i_forms]);
				if (this_form.prop("id") == "") {
					var temp_form_id = temp_table_id+"f"+i_forms;
					this_form.prop("id", temp_form_id);
				} else {
					var temp_form_id = this_form.prop("id");
				}
				var temp_form_table_id = this_form.data("table_index");
				if (typeof(temp_form_table_id) === "undefined") {
					this_form.data("table_index", this_table);
				} else {
					this_form.data("table_index", $("#"+temp_form_table_id));
				}
				this_form.on("submit", function(e) {
					e.preventDefault();
					_self.updateTable(raw,$(this).data("table_index"));
				});
			}
			_tables[temp_table_id]["forms"] = temp_form_cache;
	}
}
	
}).apply(SearchModule);