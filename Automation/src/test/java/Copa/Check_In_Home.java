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

public class Check_In_Home
{
	//Search by passing OrderID
	public void searchbyOrderid(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String orderID = queryObjects.getTestData("PNR");
		System.out.println("PNR IS " + orderID);
		
		if(orderID.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Search using Order ID failed", "OrderID passed is empty. Populate it", null);
		else
		{
			driver.findElementById(Util.checkin_page_objects.OrderIDTextBox).clear();
			driver.findElementById(Util.checkin_page_objects.OrderIDTextBox).sendKeys(orderID);
			driver.findElement(By.id("Toolbar Done Button")).click();
			//System.out.println("Done pressed");
			Thread.sleep(2000);
			driver.findElementById(Util.checkin_page_objects.OrderIDSearchButton).click();
			int count=0;
			//take screen
			while(true) {
				//element is found
				if(driver.findElementsById("Check-In").size()!= 1)	
				{	
					Thread.sleep(180);
					queryObjects.logStatus(driver, Status.INFO, "searching","toast message", null);
					count=count+1;
					if(count>5)
						break;
				}
			}
			
			try
			{
				//wait until check-in is displayed. i.e, check in screen is loaded
				new WebDriverWait(driver, 40).until(ExpectedConditions.presenceOfElementLocated(By.id("Check-In")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Check-in is loaded", "Check-in is loaded", null);
				//Thread.sleep(10000);
			}
			catch(TimeoutException e)
			{
				TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "No ETKT", null);
			}
		}
	}

	//Search by passing ETKT
	public void searchbyETKT(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String ETKT = queryObjects.getTestData("ETKT");
		if(ETKT.contains("."))
			ETKT = ETKT.substring(0, ETKT.indexOf("."));
		System.out.println("ETKT IS " + ETKT);
		if(ETKT.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Search using ETKT failed", "ETKT passed is empty. Populate it", null);
		else
		{
			driver.findElementById(Util.checkin_page_objects.OrderIDTextBox).clear();
			driver.findElementById(Util.checkin_page_objects.OrderIDTextBox).sendKeys(ETKT);
			driver.findElement(By.id("Toolbar Done Button")).click();
			//System.out.println("Done pressed");
			Thread.sleep(4000);
			driver.findElementById(Util.checkin_page_objects.OrderIDSearchButton).click();
			int count=0;
			//take screen
			while(true) {
				//element is found
				if(driver.findElementsById("Check-In").size()!= 1)	
				{	
					Thread.sleep(130);
					queryObjects.logStatus(driver, Status.INFO, "searching","toast message", null);
					count=count+1;
					if(count>8)
						break;
				}
			}
			
			try
			{
				//wait until check-in is displayed. i.e, check in screen is loaded
				new WebDriverWait(driver, 25).until(ExpectedConditions.presenceOfElementLocated(By.id("Check-In")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Check-in is loaded", "Check-in is loaded", null);
				//Thread.sleep(10000);
			}
			catch(TimeoutException e)
			{
				TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "ETKT Revoked", null);
			}
		}
	}

	//Search by passing FQTV
	public void searchbyFQTV(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String FQTV = queryObjects.getTestData("FQTV");
		String PNRF = queryObjects.getTestData("PNR");
		if(FQTV.contains("."))
			FQTV = FQTV.substring(0, FQTV.indexOf("."));
		System.out.println("ETKT IS " + FQTV);
		if(FQTV.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Search using FQTV failed", "FQTV passed is empty. Populate it", null);
		else
		{
			driver.findElementById(Util.checkin_page_objects.OrderIDTextBox).clear();
			driver.findElementById(Util.checkin_page_objects.OrderIDTextBox).sendKeys(FQTV);
			driver.findElement(By.id("Toolbar Done Button")).click();
			//System.out.println("Done pressed");
			Thread.sleep(4000);
			driver.findElementById(Util.checkin_page_objects.OrderIDSearchButton).click();
			int count=0;
			//take screen
			while(true) {
				//element is found
				if(driver.findElementsById("Check-In").size()!= 1)	
				{	
					Thread.sleep(130);
					queryObjects.logStatus(driver, Status.INFO, "searching","toast message", null);
					count=count+1;
					if(count>3)
						break;
				}
			}
			
			try {
				new WebDriverWait(driver, 25).until(ExpectedConditions.presenceOfElementLocated(By.id("fqtvlist_continue")));
				driver.findElementById(PNRF).click();
				Thread.sleep(2000);
				driver.findElementById("fqtvlist_continue").click();
				Thread.sleep(5000);
				queryObjects.logStatus(driver, Status.PASS, "Checking if Check-in is loaded", "Check-in is loaded", null);
			} catch (Exception e) {
				// TODO: handle exception
			}
			try
			{
				//wait until check-in is displayed. i.e, check in screen is loaded
				new WebDriverWait(driver, 25).until(ExpectedConditions.presenceOfElementLocated(By.id("Check-In")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Check-in is loaded", "Check-in is loaded", null);
				//Thread.sleep(10000);
			}
			catch(TimeoutException e)
			{
				TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "WRONG FQTV / PAX NOT FOUND", null);
			}
		}
	}

	public void searchbyflightNumber(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String flight = queryObjects.getTestData("FlightNum");
		if(flight.contains("."))
			flight = flight.substring(0, flight.indexOf("."));
		driver.findElementByAccessibilityId("search_flight").sendKeys(flight);
		driver.findElementByAccessibilityId("search_name").sendKeys(queryObjects.getTestData("LastName"));
		driver.findElement(By.id("Toolbar Done Button")).click();
		Thread.sleep(4000);
		driver.findElementByAccessibilityId("search_button").click();
		Thread.sleep(20000); //to wait for loading 
		if(driver.findElementsByAccessibilityId("Check-In").size()>0) // Got a single PNR loaded
		{
			queryObjects.logStatus(driver, Status.PASS, "Checking if search happened", "Got required pax", null);
		}
		else if(driver.findElementsByAccessibilityId("Search Result").size()>0) // Got multiple names. need to select
		{
			//System.out.println("in search resultd");
			driver.findElementByAccessibilityId(queryObjects.getTestData("PNR")).click(); //select the correct pax
			driver.findElementByAccessibilityId("search_continue").click(); //click on Proceed to Check-In
			queryObjects.logStatus(driver, Status.PASS, "Checking if search happened", "Got multiple pax, selected necessary one", null);
			Thread.sleep(10000); //to finish loading the Check-In screen
		}
		else //excel sheet data is wrong
		{
			queryObjects.logStatus(driver, Status.FAIL, "Checking if search happened", "Excel data FlightNum / LastName Wrong. Re-populate", null);
		}
		Thread.sleep(20000); //to wait for loading
	}
}