package Copa;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;

import org.openqa.selenium.By;
import org.openqa.selenium.remote.RemoteWebElement;

import com.aventstack.extentreports.Status;

import FrameworkCode.BFrameworkQueryObjects;
import io.appium.java_client.TouchAction;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class Common_funs
{	
	//SWIPE METHODS
	public static void swipe_down_with_XPath(IOSDriver driver, String Xpath) 
	{
		RemoteWebElement parent = (RemoteWebElement)driver.findElement(By.xpath(Xpath)); //identifying the parent Table
		String parentID = parent.getId();
		HashMap<String, String> scrollObject = new HashMap<String, String>();
		scrollObject.put("element", parentID);
		// Use the predicate that provides the value of the label attribute
		//scrollObject.put("id", "PTY PTY ATO");
		scrollObject.put("direction", "down");

		driver.executeScript("mobile:scroll", scrollObject);
		//el3.click();// scroll to the target element
	}
	
	public static void swipe_down_wo_Xpath_with_coordinates(IOSDriver driver) throws IOException
	{
		TouchAction swipe = new TouchAction(driver)
				.press(PointOption.point(506,580))
				.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
				.moveTo(PointOption.point(506,380))
				.release()
				.perform();
		
	}
}