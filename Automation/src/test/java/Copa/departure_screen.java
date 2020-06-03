package Copa;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.aventstack.extentreports.Status;
import FrameworkCode.BFrameworkQueryObjects;
import FrameworkCode.StartFramework;
import io.appium.java_client.TouchAction;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class departure_screen
{
	//Search by passing Destination
	public void searchFlightbyDestination(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String dest = queryObjects.getTestData("Destination");
		if(dest.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Search using Destination failed", "Destination passed is empty. Populate it", null);
		else
		{
			driver.findElementByAccessibilityId(Util.departure_page_objects.DestTextBox).sendKeys(dest);
			driver.findElement(By.id("Done")).click();
			//System.out.println("Done pressed");
			Thread.sleep(4000);
			driver.findElementByAccessibilityId("dep_desicon").click();
			Thread.sleep(10000);
			queryObjects.logStatus(driver, Status.PASS, "Search using Destination passed", "Destination passed is valid", null);
		}
	}
	
	public void DepHomeSpecifiedFlight(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String Flight = queryObjects.getTestData("Dflight");
		if(Flight.contains("."))
			Flight = Flight.substring(0, Flight.indexOf("."));
		Flight = "CM" + Flight;
		if(Flight.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "No Flight is specified", "Specify Flight number and retry", null);
		else
		{
			
				if (driver.findElementsByAccessibilityId("dephome_"+Flight).size() == 0) 
				{
					queryObjects.logStatus(driver, Status.FAIL, "Checking if Flight specified is loaded", "Specified Flight number not present", null);
				}
				else 
				{
					driver.findElementByAccessibilityId("dephome_"+Flight).click();
					try
					{
						//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath("//XCUIElementTypeButton[contains(@name, 'Checkedin (')]")));
						new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath(Util.departure_page_objects.Flight_Ckd_in)));
						
						queryObjects.logStatus(driver, Status.PASS, "Selected Flight loaded", "Displayed the flight's status", null);
						Thread.sleep(2000); //this is to get all elements as active and not blacked out
					}
					catch(TimeoutException e)
					{
						TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
						queryObjects.logStatus(driver, Status.FAIL, "Selected Flight not loaded", "Can't display the flight's status", null);
						Thread.sleep(2000); //this is to get all elements as active and not blacked out
					}
					
				}
			}	
		
	}
	
	
	
	public void searchFlightbyGate(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String Gate = queryObjects.getTestData("Gate_num");
		if(Gate.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Search using Gate failed", "Gate passed is empty. Populate it", null);
		else
		{
			driver.findElementByAccessibilityId(Util.departure_page_objects.GateTextBox).sendKeys(Gate);
			driver.findElement(By.id("Done")).click();
			Thread.sleep(4000);
			driver.findElement(By.id("dep_gateicon")).click();
			Thread.sleep(10000);
			queryObjects.logStatus(driver, Status.PASS, "Search using Gate passed", "Gate passed is valid", null);
		}
	}

	public void SeeAllDepFlights(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId("dep_all").click();
		try
		{
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("ONTIME")));
			//System.out.println("Flight appeared in All Departures");
			Thread.sleep(5000);
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.PASS, "Checking if All flights in Departures are loaded", "All Departure flights are loaded", null);
			Thread.sleep(2000); //this is to get all elements as active and not blacked out
		}
		catch(TimeoutException e)
		{
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Checking if All flights in Departures are loaded", "All Departure flights are not loaded", null);
			Thread.sleep(2000); //this is to get all elements as active and not blacked out
		}
    }

	public void ClickSpecifiedFlight(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		int swipecount = 0;
		String Flight = queryObjects.getTestData("Dflight");
		if(Flight.contains("."))
			Flight = Flight.substring(0, Flight.indexOf("."));
		Flight = "CM" + Flight;
		if(Flight.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "No Flight is specified", "Specify Flight number and retry", null);
		else
		{
			while(true) 
			{
				if (driver.findElementsByAccessibilityId("depall_"+Flight).size() == 0) 
				{
					Common_funs.swipe_down_with_XPath(driver, "//XCUIElementTypeApplication[@name=\"COPA Airport\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeTable");
					swipecount = swipecount + 1; 
				}
				else 
				{
					driver.findElementByAccessibilityId("depall_"+Flight).click();					
					try
					{
						//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Checkedin (")));
						//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath("//XCUIElementTypeButton[contains(@name, 'Checkedin (')]")));
						new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath(Util.departure_page_objects.Flight_Ckd_in)));
						
						//driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, 'Business')]");
						//XCUIElementTypeButton[@name="Checkedin (0)"]
						//Thread.sleep(5000);
						queryObjects.logStatus(driver, Status.PASS, "Clicking Flight specified", "Specified Flight number loaded", null);
						Thread.sleep(2000); //this is to get all elements as active and not blacked out
					}
					catch(TimeoutException e)
					{
						TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
						queryObjects.logStatus(driver, Status.FAIL, "Checking if Flight specified is loaded", "Specified Flight number not loaded", null);
						Thread.sleep(2000); //this is to get all elements as active and not blacked out
					}
					break;
				}
				if(swipecount>50)
					break;
			}	
		}
	}
	
	public static void swipe_dep_check(IOSDriver driver,BFrameworkQueryObjects queryObjects) throws IOException
	{
		TouchAction swipe = new TouchAction(driver)
				.press(PointOption.point(506,580))
				.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
				.moveTo(PointOption.point(506,380))
				.release()
				.perform();
		queryObjects.logStatus(driver, Status.INFO, "Viewing 'Not Checkedin passengers' in the Flight specified", "'Not CheckedIn Passengers' tab selected", null);
	}
		
	public void SelectPaxinNotCheckedInList(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String PNR = queryObjects.getTestData("PNR");
		//to click on the "Not CheckedIn" button
		//driver.findElementByXPath("//XCUIElementTypeButton[contains(@name, 'Not Checkedin (')]").click();
		driver.findElementByXPath(Util.departure_page_objects.Flight_Not_Ckd_in).click();
		
		queryObjects.logStatus(driver, Status.INFO, "Viewing 'Not Checkedin passengers' in the Flight specified", "'Not CheckedIn Passengers' tab selected", null);
		//need to click on the line with the passenger
		while(true)
		{
			if(driver.findElementsByAccessibilityId(PNR).size()>0)
			{
				//click on the PNR specified
				driver.findElementByAccessibilityId(PNR).click();
				Thread.sleep(3000);
				//click on continue
				driver.findElementByAccessibilityId("pax_continue").click();
				Thread.sleep(2000);
				break;
			}
			else
			{
				Common_funs.swipe_down_wo_Xpath_with_coordinates(driver);
			}
		}
		//clicked on the passenger line and clicked continue
		try
		{
			//wait until check-in is displayed. i.e, check in screen is loaded
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Check-In")));
			queryObjects.logStatus(driver, Status.PASS, "Selected the specified pax from not checked-in list", "Passenger's Check-In screen loaded", null);
			Thread.sleep(10000);
		}
		catch(TimeoutException e)
		{
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Couldn't select passenger from the flight", "Passenger's Check-In screen not loaded", null);
			Thread.sleep(2000); //this is to get all elements as active and not blacked out
		}
	}
}