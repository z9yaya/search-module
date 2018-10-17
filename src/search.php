<?php 
class search {
	private $conn_sql;
	private $table;
	private $sortby;
	private $page;
	private $results = array();
	public function __constructor($table, $sortby=null, $page=null, $get=null) {
		if (empty($sortby) || empty($page)) {
			if (empty($get)) {
				return new OutCome(false, 1, "MISSING PARAMETERS");
			} else {
				$inputs = validate(array("string:table"=>$table, "string:sortby"));
			}
		}
		$inputs = validate(array("string:table"=>$table, "string:sortby"=>$sortby, "integer:page"=>$page));
		if (!$inputs[0]) {
			return new OutCome(false, 1, "INVALID PARAMETER TYPES", $inputs[1]);
		}
		$inputs = $inputs[1];
		$this->conn_sql = new sql();
		if (!($this->sql_conn)()) {
			return $this->sql_conn;
		}
		$this->table = $inputs["string:table"];
		$this->sortby = $inputs["string:sortby"];
		$this->page = $inputs["integer:page"];
		$this->page_sql = int($this->page) * 25;
		$this->page_sql = "($this->page_sql), (($this->page_sql) - 25)";
		return $this;
	}

	public function findLike($column_select, $column_where, $val_where) {
		$query = "SELECT :column_select FROM :table WHERE :column_where LIKE :val_where LIMIT :page_sql SORTBY :sortby";
		$bind = array(array(":colum_select", $column_select), array(":table", $this->table), array(":column_where", $column_where), array(":val_where", $val_where), array(":page_sql", $this->page_sql), array(":sortby", $this->sortby));
		$result = ($this->conn_sql)->Query($query, $bind);
		if (!$result())
		{
			return $result;
		}
		($this->results).append($result->getBody());
		return new OutCome(true, 2, "findLike SUCCESS", $result->getBody());
	}
	
	//public function 
}

class returnType extends OutCome {
	private $JSON;
	public function toJSON() {
		if (!empty($this->JSON)) {
			return $this->JSON;
		}
		$output = json_encode($this->toArray());
		$this->JSON = $output;
		return $output;
	}
	public function toArray() {
		if (!empty($this->array)) {
			return $this->array;
		}
		$this->array = array("status"=>($this->status).toString(), "code"=>$this->code, "body"=>$this->body, "info"=>$this->extra, "inputs"=>$this->inputs);
		return $this->array;
	}

}