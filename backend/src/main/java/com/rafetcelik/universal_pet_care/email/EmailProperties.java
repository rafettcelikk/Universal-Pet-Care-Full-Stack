package com.rafetcelik.universal_pet_care.email;

import lombok.Data;

@Data
public class EmailProperties {
	
	public static final String DEFAULT_HOST = "smtp.gmail.com";
	public static final int DEFAULT_PORT = 587;
	public static final String DEFAULT_SENDER = "petuniversal@gmail.com";
	public static final String DEFAULT_USERNAME = "blaxdrafet@gmail.com";
	public static final String DEFAULT_PASSWORD = "ctiw hgjx iqod qvio";
	public static final boolean DEFAULT_AUTH = true;
	public static final boolean DEFAULT_STARTTLS_ENABLE = true;
	
}
