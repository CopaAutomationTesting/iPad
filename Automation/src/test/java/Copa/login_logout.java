package Copa;

import java.io.IOException;
import java.util.concurrent.TimeUnit;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.aventstack.extentreports.Status;
import FrameworkCode.BFrameworkQueryObjects;
import FrameworkCode.StartFramework;
import io.appium.java_client.MobileElement;
import io.appium.java_client.ios.IOSDriver;

public class login_logout
{
	public void login(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		//MobileElement element = (MobileElement)driver.findElement(By.id("User ID"));
		MobileElement element = (MobileElement)driver.findElement(By.id(Util.login_home_objects.UserIDTextBox));
		element.sendKeys(queryObjects.getTestData("Username"));
		driver.findElement(By.id("next")).click(); //for clicking next
		//for pwd
		//element = (MobileElement) driver.findElement(By.id("Password"));
		element = (MobileElement) driver.findElement(By.id(Util.login_home_objects.PwdTextBox));
		element.sendKeys(queryObjects.getTestData("Pwd"));
		driver.findElement(By.id("Done")).click(); //for clicking done
		
		driver.findElement(By.id(Util.login_home_objects.LoginButton)).click(); //click on login
		
		//wait until the logoff button appears
		try
		{
			//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("logoff edit")));
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id(Util.login_home_objects.LogoffButton)));
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.PASS, "Checking if logged in", "Login Done", null);
		}
		catch(TimeoutException e)
		{
			TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Checking if logged in", "Login Failed", null);
		}
	}
	
	public void logout(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		Thread.sleep(5000);
		//driver.findElement(By.id("logoff edit")).click();
		driver.findElement(By.id(Util.login_home_objects.LogoffButton)).click();
		driver.findElement(By.id("OK")).click(); //for clicking OK button
		TimeUnit.SECONDS.sleep(1); //to wait to get screenshot
		queryObjects.logStatus(driver, Status.PASS, "Checking if logged out", "Logout Done", null);
		Thread.sleep(5000);
	}
}