package com.wcjung.demoapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApiApplication {

	@RequestMapping("/")
	  public String home() {
	    return "Hello World v2";
	  }
	
	public static void main(String[] args) {
		SpringApplication.run(DemoApiApplication.class, args);

	}
}
