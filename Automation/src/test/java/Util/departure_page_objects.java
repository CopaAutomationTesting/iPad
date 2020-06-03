package Util;

public class departure_page_objects 
{
	//public static String OrderIDTextBox="//XCUIElementTypeTextField[@name=\"search_any\"]"; //XPath : Checkin screen -> TextBox to paste OrderID
	//public static String OrderIDSearchButton="//XCUIElementTypeButton[@name=\"\"]"; //XPath : Checkin screen -> Button next to OrderID TextBox
	
	public static String GateTextBox="dep_gate"; //id : Checkin screen -> TextBox to paste OrderID
	public static String GateSearchButton="dep_gateicon"; //XPath : Checkin screen -> Button next to OrderID TextBox
	public static String DestTextBox="dep_des"; //id : Checkin screen -> TextBox to paste OrderID
	public static String DestSearchButton="dep_desicon"; //XPath : Checkin screen -> Button next to OrderID TextBox
	public static String Flight_Ckd_in="//XCUIElementTypeButton[contains(@name, 'Checkedin (')]";
	public static String Flight_Not_Ckd_in="//XCUIElementTypeButton[contains(@name, 'Not Checkedin (')]";
}
