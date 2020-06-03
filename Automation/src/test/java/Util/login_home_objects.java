package Util;

public class login_home_objects 
{
	public static String UserIDTextBox="login_usr"; //ID : 1st screen -> username textbox
	public static String PwdTextBox="login_pwd"; //ID : 1st screen -> password textbox
	public static String LoginButton="login_btn"; //ID : 1st screen -> Login Button
	//login_btn forlogin button
	public static String LogoffButton="logoff edit"; //ID : home screen -> logoff button
	public static String POSButton="//XCUIElementTypeButton[@name=\"location edit\"]"; //XPath : home screen -> POS Button
	public static String POS_PTY="//XCUIElementTypeSheet[@name=\"Change Sales Office\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[2]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther[307]";
	
	public static String Pax_Search="//XCUIElementTypeStaticText[@name=\"Passenger Search\"]";
	public static String Gate_Num="(//XCUIElementTypeStaticText[@name=\"Gate No.\"])[1]";
	public static String Compensation="(//XCUIElementTypeStaticText[@name=\"Compensation\"])[1]";
	//public static String POSButton="location edit"; //ID : home screen -> POS Button

	public static String HomeCheckInButton="home_checkin"; //ID : Home Screen -> Check-in button
	public static String HomeDepButton="home_dep"; //ID : Home Screen -> Departure button
	public static String HomeCompButton="home_comp"; //ID : Home Screen -> Compensation button
}