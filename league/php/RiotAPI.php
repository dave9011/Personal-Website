
<?php

	class RiotAPI {

		private $data = null;
		
		public function load(data){
			$this->data = data;
		}
		
		public function testClass(){
			echo 'testing RiotAPI';
		}
		
		//your api calls and stuff
		public function getSummoner($region, $name){
			
			$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v1.4/summoner/by-name/" . rawurlencode($name) . "?api_key=" . MY_API_KEY;
			$data = file_get_contents($url);
			
			//set response code
			Engine::$response = parseHeaders($http_response_header);
			// //if the API call was successfull (summoner found)
			if(Engine::$response['response_code'] == 200){
				$data = json_decode($data);
				//Riot returns an object with Keys labeled by the name of who we are search. 
				//The name is made lowercase, and all spaces in the name get removed.
				$index = preg_replace('/\s+/', '', $name);
				return $data->$index;
			} else {
				//failed return error code instead of $data
				Engine::$errorFlag = true;
				
				return null;
			}
			
		}
		
	}
	
?>