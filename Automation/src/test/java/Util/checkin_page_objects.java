package Util;

public class checkin_page_objects 
{
	//public static String OrderIDTextBox="//XCUIElementTypeTextField[@name=\"search_any\"]"; //XPath : Checkin screen -> TextBox to paste OrderID
	//public static String OrderIDSearchButton="//XCUIElementTypeButton[@name=\"\"]"; //XPath : Checkin screen -> Button next to OrderID TextBox
	
	public static String OrderIDTextBox="search_any"; //id : Checkin screen -> TextBox to paste OrderID
	public static String OrderIDSearchButton="search_icon"; //XPath : Checkin screen -> Button next to OrderID TextBox
	public static String bag_0="chk_bag0";
	public static String btn_offload="btn_offload";
	public static String chk_apis="0chk_apis";
	
	public static String checkin_scroll="//XCUIElementTypeScrollView[@name=\"checkin_scroll\"]";
	public static String fqtv_carrier="//XCUIElementTypeApplication[@name=\"COPA Airport\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeTable";
}
