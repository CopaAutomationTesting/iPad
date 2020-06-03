package Copa;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.By.ByXPath;
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

public class home_screen
{
	public void POS_Change(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String POS = queryObjects.getTestData("POS");
		String Currency = queryObjects.getTestData("Currency");
		driver.findElement(By.id(Util.login_home_objects.POSButton)).click();
		try
		{
			while(true) 
			{
				if (driver.findElementsByAccessibilityId(POS).size() == 0) 
				{
					TouchAction swipe = new TouchAction(driver)
		            .press(PointOption.point(511,650))
		            .waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
		            .moveTo(PointOption.point(511,200))
		            .release()
		            .perform();
				}
				else //city is present. Click on it and select the currency
				{
					driver.findElementByAccessibilityId(POS).click();
					Thread.sleep(2000);
					driver.findElementByAccessibilityId(Currency).click();
					Thread.sleep(15000);
					TimeUnit.SECONDS.sleep(3); //to wait to get screenshot
					queryObjects.logStatus(driver, Status.PASS, "Checking if POS changed", "POS changed", null);
					break;
				}
			}	
		}
		catch(Exception e)
		{
			queryObjects.logStatus(driver, Status.FAIL,"The given POS is not available", "Couldn't change POS"+e.getLocalizedMessage(),e);
		}
	}

	public void POS_Change_PTY(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		//System.out.println("inside pos pty");
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("logoff edit")));
		driver.findElement(By.xpath(Util.login_home_objects.POSButton)).click();

		//driver.findElement(By.xpath("//XCUIElementTypeSheet[@name=\"Change Sales Office\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[2]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther[307]")).click();
		driver.findElement(By.xpath(Util.login_home_objects.POS_PTY)).click();
		
		Thread.sleep(2000);
		driver.findElementByAccessibilityId("USD").click();
		Thread.sleep(15000);
		TimeUnit.SECONDS.sleep(3); //to wait to get screenshot
		queryObjects.logStatus(driver, Status.PASS, "Checking if POS changed", "POS changed", null);
	}
	
	//Click on the check-in module
	public void SelectCheckIN(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		//driver.findElementByAccessibilityId("home_checkin").click();
		driver.findElementByAccessibilityId(Util.login_home_objects.HomeCheckInButton).click();
 		try
		{
			//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath("//XCUIElementTypeStaticText[@name=\"Passenger Search\"]")));
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath(Util.login_home_objects.Pax_Search)));
			
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.PASS, "Checking if check-in is loaded", "Check-in is loaded", null);
		}
		catch(TimeoutException e)
		{
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Checking if check-in is loaded", "Check-in couldn't be loaded", null);
		}
	}

	//Click on the Departures_Module
	public void SelectDeparture(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.login_home_objects.HomeDepButton).click();
 		try
		{
			//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath("(//XCUIElementTypeStaticText[@name=\"Departures\"])[1]")));
 			//Wait until the text Gate No is present
 			//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath("(//XCUIElementTypeStaticText[@name=\"Gate No.\"])[1]")));
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath(Util.login_home_objects.Gate_Num)));
			
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.PASS, "Checking if Departures page loaded", "Departures loaded", null);
			//System.out.println("Giving wait to get the flights populated");
			//Thread.sleep(5000); //this is to get all elements as active and not blacked out
			Thread.sleep(3000); //this is to get all elements as active and not blacked out
		}
		catch(TimeoutException e)
		{
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Checking if Departures is loaded", "Departures couldn't be loaded", null);
		}
	}

	//Click on the compensation_module
	public void SelectCompensation(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.login_home_objects.HomeCompButton).click();
		Thread.sleep(10000);
		try
		{
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.xpath("(//XCUIElementTypeStaticText[@name=\"Compensation\"])[1]")));
			System.out.println("Compensation text has appeared");
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is clicked", "Compensation is clicked", null);
			System.out.println("Giving wait to get the details populated");
			Thread.sleep(15000); //this is to get all elements as active and not blacked out
		}
		catch(TimeoutException e)
		{
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Checking if Compensation is loaded", "Compensation couldn't be loaded", null);
		}
	}
}