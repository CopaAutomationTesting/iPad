package Copa;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.aventstack.extentreports.Status;

import FrameworkCode.BFrameworkQueryObjects;
import io.appium.java_client.MobileElement;
import io.appium.java_client.TouchAction;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;

public class Compensation_screen {

	public void searchbyOrderid(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String orderID = queryObjects.getTestData("COPNR");
		System.out.println("PNR IS " + orderID);
		if (orderID.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Search using Order ID failed", "OrderID passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.OrderIDTextBox).sendKeys(orderID);
			driver.findElement(By.id("Toolbar Done Button")).click();
			Thread.sleep(4000);
			driver.findElementByAccessibilityId(Util.compensation_page_objects.OrderIDSearchButton).click();
			Thread.sleep(10000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Flight")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded", "Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
			}
		}
	}

	public void clickOnRequiredFlight(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String flightno = queryObjects.getTestData("COFlightNo");
		if (flightno.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "No Flight is specified", "Specify Flight number and retry", null);

		else {

			driver.findElementByAccessibilityId(flightno).click();
			Thread.sleep(5000);
			driver.findElementByAccessibilityId("compselseg_continue").click();
			Thread.sleep(15000);
			queryObjects.logStatus(driver, Status.PASS, "Clicking Flight specified", "Specified Flight number clicked",	null);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if passenger list is loaded",	"Passenger list is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Passenger list not loaded", "Not found", null);
			}
		}
	}

	public void searchByFlightNum(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String flightno = queryObjects.getTestData("COFlightNo");
		String passengerlist = queryObjects.getTestData("COPaxList");
		if (flightno.isEmpty() || passengerlist.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "No Flight is specified", "Specify Flight number and retry", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.FlightNumTextBox).sendKeys(flightno);
			driver.findElement(By.id("Toolbar Done Button")).click();
			Thread.sleep(4000);
			driver.findElementByAccessibilityId(Util.compensation_page_objects.PassengerList).click();
			driver.findElementByAccessibilityId(passengerlist).click();
			driver.findElementByAccessibilityId("Search").click();
			Thread.sleep(15000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if passenger list is loaded",	"passenger list is loaded", null);

			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Flight not found", "Select proper passenger type", null);
			}
		}
	}

	public void SelectCompReason(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String Reason = queryObjects.getTestData("COReason");
		System.out.println("Reason IS " + Reason);
		if (Reason.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Select Compensation reason failed", "Reason not populated,populate it", null);
		else {
			try {
				driver.findElementByAccessibilityId(Util.compensation_page_objects.CompReasonDropdown).click();
				MobileElement el5 = (MobileElement) driver.findElementById("Search");
				el5.sendKeys(Reason.substring(0, Reason.length() - 1));
				driver.findElement(By.id("Toolbar Done Button")).click();
				driver.findElementByAccessibilityId(Reason).click();
				Thread.sleep(3000);
				queryObjects.logStatus(driver, Status.PASS, "The given compensation reason selected", "selected reason",null);

			} catch (Exception e) {
				queryObjects.logStatus(driver, Status.FAIL, "The given compensation reason is not available", "Couldn't select reason" + e.getLocalizedMessage(), e);
			}
		}
	}

	public void selectAllPassengers_Comp(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.SelectAllPassengers_Comp).click();
		queryObjects.logStatus(driver, Status.PASS, "All passengers selected", "Passenger selected", null);
		Thread.sleep(15000);
	}

	public void selectPassenger_Comp(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.SelectPassenger_Comp).click();
		queryObjects.logStatus(driver, Status.PASS, " passenger selected", "Passenger selected", null);
		Thread.sleep(6000);
	}

	/*
	 * public void select6Passenger_Comp(IOSDriver driver, BFrameworkQueryObjects
	 * queryObjects) throws IOException, InterruptedException {
	 * 
	 * driver.findElementByAccessibilityId("comp_passenger0").click();
	 * driver.findElementByAccessibilityId("comp_passenger1").click();
	 * driver.findElementByAccessibilityId("comp_passenger2").click();
	 * driver.findElementByAccessibilityId("comp_passenger3").click();
	 * driver.findElementByAccessibilityId("comp_passenger4").click();
	 * driver.findElementByAccessibilityId("comp_passenger5").click();
	 * queryObjects.logStatus(driver, Status.PASS, " passenger selected",
	 * "Passenger selected", null); Thread.sleep(6000);
	 * 
	 * }
	 */

	public void compContinue(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.Continue).click();
		Thread.sleep(40000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Hotel")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if Issue Compensation page is loaded", "Issue Compensation is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Page not loaded", "Not found", null);
		}
	}

	public void compContinue_fail(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.Continue).click();
		Thread.sleep(15000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if Issue Compensation page is loaded", "Issue Compensation is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "success", "found", null);
		}
	}

	public void Continue_compnotIss(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.comprestab_continue).click();
		Thread.sleep(30000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Hotel")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if Issue Compensation page is loaded", "Issue Compensation is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Page not loaded", "Not found", null);
		}
	}

	// drop down in passenger list to filter
	public void compDropDown(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String option = queryObjects.getTestData("CODropDownSelection");
		System.out.println("option is " + option);
		if (option.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "Selecting the filter failed", "Option passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.DropDownSelection).click();
			driver.findElementByAccessibilityId(option).click();
			Thread.sleep(4000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation page is loaded", "Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Option not selected", "Not found", null);
			}
		}
	}

	// edit in label column in issue compensation page
	public void Edit_in_isscom(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Edit).click();
		Thread.sleep(3000);
	}

	public void issue_AdditionalDet_Edit(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.Issuetab_navdetails).click();
		System.out.println("clicked additional details");
		Thread.sleep(10000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Compensation Details")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if Additional details screen is loaded", "Additional details is loaded", null);

		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "page not loaded", " add_details screen not found", null);
		}
		Thread.sleep(10000);
	}

	// after compensation issued page
	public void EditEmail(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String email = queryObjects.getTestData("COEMAIL");
		System.out.println("email IS " + email);
		if (email.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "method failed", "input passed is empty. Populate it", null);
		else {

			driver.findElementByAccessibilityId(Util.compensation_page_objects.Issuetab_Edit).click();
			Thread.sleep(30000);
			driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Email\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther")).clear();
			Thread.sleep(5000);
			driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Email\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther")).sendKeys(email);
			driver.findElementByAccessibilityId(Util.compensation_page_objects.Email_Save).click();
			Thread.sleep(7000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded", "Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
			}
		}
	}

	// edit email in emd available for print page
	public void EditEmail_emdavailprint(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String email = queryObjects.getTestData("COEMAIL");
		System.out.println("email IS " + email);
		if (email.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "method failed", "input passed is empty. Populate it", null);
		else {

			driver.findElementByAccessibilityId(Util.compensation_page_objects.compprint_emailitem).click();
			Thread.sleep(40000);
			driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Email\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther")).clear();
			Thread.sleep(5000);
			driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Email\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther")).sendKeys(email);
			driver.findElementByAccessibilityId(Util.compensation_page_objects.Email_Save).click();
			Thread.sleep(7000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded", "Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
			}
		}
	}

	// display the email of the passenger
	public void EditEmail_emdavailprint_Show(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.compprint_emailitem).click();
		Thread.sleep(40000);
		driver.findElementByAccessibilityId(Util.compensation_page_objects.Email_Cancel).click();
		Thread.sleep(7000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Save")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded", "Compensation is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
		}

	}

	public void issue_Amt(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String amt = queryObjects.getTestData("COAMT");
		System.out.println("AMT IS " + amt);
		String amt_overide_reason = queryObjects.getTestData("COAmt_override");
		System.out.println("Amt over ride reason IS " + amt_overide_reason);
		if (amt.isEmpty() && amt_overide_reason.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "function failed", "amount passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_changeamount).clear();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_changeamount).sendKeys(amt);
			driver.findElement(By.id("Toolbar Done Button")).click();
			MobileElement e1 = (MobileElement) driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Other Details\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther"));
			e1.sendKeys(amt_overide_reason);
			driver.findElementByAccessibilityId("Copy to selected passenger & Save").click();
			Thread.sleep(4000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded", "Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
			}
		}
	}

	public void issue_Trans(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String trans = queryObjects.getTestData("COTRANS");
		String trans_overide_reason = queryObjects.getTestData("COTrans_override");
		System.out.println("Hotel over ride reason IS " + trans_overide_reason);
		System.out.println("transport value IS " + trans);
		if (trans.isEmpty() && trans_overide_reason.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "method  failed", "input passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGETRANS).clear();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGETRANS).sendKeys(trans);
			driver.findElement(By.id("Toolbar Done Button")).click();
			try {
				MobileElement e1 = (MobileElement) driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Other Details\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther"));
				e1.sendKeys(trans_overide_reason);
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded","Compensation is loaded", null);
				driver.findElementByAccessibilityId("Copy to selected passenger & Save").click();
				Thread.sleep(4000);
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded","Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
			}
		}
	}

	public void issue_Hotel(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String hotel = queryObjects.getTestData("COHOTEL");
		String hotel_overide_reason = queryObjects.getTestData("COHotel_overide");
		System.out.println("Hotel value IS " + hotel);
		System.out.println("Hotel over ride reason IS " + hotel_overide_reason);
		if (hotel.isEmpty() && hotel_overide_reason.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "method  failed", "input passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGEHOTEL).clear();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGEHOTEL).sendKeys(hotel);
			driver.findElement(By.id("Toolbar Done Button")).click();
			try {
				MobileElement e1 = (MobileElement) driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Other Details\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther"));
				e1.sendKeys(hotel_overide_reason);
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded","Compensation is loaded", null);
				driver.findElementByAccessibilityId("Copy to selected passenger & Save").click();
				Thread.sleep(4000);
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded","Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
			}
		}
	}

	public void issue_Meal(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String Meal = queryObjects.getTestData("COMEAL");
		String Meal_overide_reason = queryObjects.getTestData("COMeal_override");
		System.out.println("Meal value IS " + Meal);
		System.out.println("Meal over ride reason IS " + Meal_overide_reason);
		if (Meal.isEmpty() && Meal_overide_reason.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "method  failed", "input passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGEMEAL).clear();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGEMEAL).sendKeys(Meal);
			driver.findElement(By.id("Toolbar Done Button")).click();
			MobileElement e1 = (MobileElement) driver.findElement(By.xpath("//XCUIElementTypeAlert[@name=\"Other Details\"]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeScrollView[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeCollectionView/XCUIElementTypeCell/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther"));
			e1.sendKeys(Meal_overide_reason);
			driver.findElementByAccessibilityId("Copy to selected passenger & Save").click();
			Thread.sleep(4000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded","Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
			}
		}
	}

	// this meal value cannot be accepted
	public void issue_Meal_fail(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String Meal = queryObjects.getTestData("COMEALFAIL");
		System.out.println("Meal value IS " + Meal);
		if (Meal.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "method  failed", "input passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGEMEAL).clear();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.ISSUECOMP_CHANGEMEAL).sendKeys(Meal);
			driver.findElement(By.id("Toolbar Done Button")).click();
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if Compensation is loaded","Compensation is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.PASS, "Unable to proceed", "Not found", null);
			}
		}
	}

	// clicking done in label column in issue compensation
	public void Done_in_isscom(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Done).click();
		Thread.sleep(3000);

	}

	// click ok after editing additional details
	public void EMD_OK(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.EMD_OK).click();
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Hotel")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if  issue Compensation page is loaded","issue Compensation is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "issue compensation page not loaded", "Not found", null);
		}

	}

	// goes to compensation details tab
	public void EMD(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.CompensationDetails).click();
		Thread.sleep(2000);
		System.out.println("incompensation deatils..going to click meal emd button");
		Thread.sleep(4000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("OK")));
			queryObjects.logStatus(driver, Status.PASS, "Page is loaded", "Compensation page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}
	}

	// Meals EMd input editing compensation details tab
	public void Meal_Input(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String Meal = queryObjects.getTestData("COMEAL_INPUT");
		System.out.println("Meal input IS " + Meal);
		if (Meal.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "meal input function failed","meal input passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.CompensationMealEMD).click();
			Thread.sleep(2000);
			driver.findElementByAccessibilityId(Util.compensation_page_objects.Meal_Input).sendKeys(Meal);
			driver.findElement(By.id("Toolbar Done Button")).click();
			Thread.sleep(4000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("OK")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
			}
		}
	}
    //select all passengers in Issue compensation page
	public void issueComp_SelectAllPassengers(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_SelectAllPassengers).click();
		queryObjects.logStatus(driver, Status.PASS, "All passengers selected", "Passenger selected", null);
		Thread.sleep(6000);

	}
	// compensation details copy to the selected passengers
	public void copyToSelectedPassengersEMD(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.copyToSelectedPassengersEMD).click();
		Thread.sleep(4000);
		try {

			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("OK")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if copied", "copied to selected passengers", null);

		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
		}
	}
	
	  // reaccommodation details copy to the selected passengers
		public void copyToSelectedPassengersReaccomodation(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
		{

			driver.findElementByAccessibilityId(Util.compensation_page_objects.copyToSelectedPassengersreaccomodation).click();
			Thread.sleep(4000);
			try {

				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("OK")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if copied", "copied to selected passengers", null);

			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
			}
		}


	// continue page additional details edit button click
	public void additionalDet_Edit(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException {
		driver.findElement(By.id(Util.compensation_page_objects.AdditionalDetails)).click();

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Reaccomodation")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if reaccomodation is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}

	//select  2 passengers
	public void issueComp_SelecttwoPassengers(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax0).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax1).click();
		queryObjects.logStatus(driver, Status.PASS, "passengers selected", "Passengers selected", null);
		Thread.sleep(6000);

	}
    //select one passenger
	public void issueComp_SelectPassenger(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax0).click();
		queryObjects.logStatus(driver, Status.PASS, "passengers selected", "Passengers selected", null);
		Thread.sleep(6000);

	}

	//select passenger in compensation not issued tab
	public void selectPax_CompnotIss(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.comprestab_toggle0).click();
		Thread.sleep(6000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "passenger selected", "Passenger selected", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}

	public void select3Pax_CompnotIss(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.comprestab_toggle0).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.comprestab_toggle1).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.comprestab_toggle2).click();
		Thread.sleep(6000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "passenger selected", "Passenger selected", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}

	public void compnotissue_DeletePax(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.comprestab_delete).click();
		Thread.sleep(20000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}
	}

	public void re_Accomdation(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.ReAccomdation).click();
		Thread.sleep(4000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Flight#")));
			queryObjects.logStatus(driver, Status.PASS, "Clicked reaccomodation", "Reaccomodation tab", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
		}
	}

	// to flight
	public void to_flight(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String flight = queryObjects.getTestData("COTOFLIGHT");
		System.out.println("toflight input IS " + flight);
		String date_month = queryObjects.getTestData("COTOMonth");
		System.out.println("toflight input IS " + date_month);
		String date_year = queryObjects.getTestData("COTOYear");
		System.out.println("toflight input IS " + date_year);
		String date_day = queryObjects.getTestData("COTODay");
		System.out.println("toflight input IS " + date_day);
		String from = queryObjects.getTestData("COTO_FROM");
		System.out.println("toflight input IS " + from);
		String to = queryObjects.getTestData("COTO_TO");
		System.out.println("toflight input IS " + to);
		if (flight.isEmpty() && date_month.isEmpty() && date_year.isEmpty() && date_day.isEmpty() && from.isEmpty() && to.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "meal input function failed","meal input passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.To_Flight).click();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.To_Flight_No).sendKeys(flight);
			driver.findElement(By.id("Toolbar Done Button")).click();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.To_Date).click();
           List <MobileElement> values= driver.findElementsByXPath("//XCUIElementTypePickerWheel");
           for(int i=0;i<values.size();i++)
           {
        	  System.out.println(values.get(i).getText()); 
           }
           values.get(0).sendKeys(date_day);
           values.get(0).sendKeys(Keys.TAB);
           values.get(1).sendKeys(date_month);
           values.get(1).sendKeys(Keys.TAB);
           values.get(2).sendKeys(date_year);
           values.get(2).sendKeys(Keys.TAB);
           Thread.sleep(3000);
  
			driver.findElement(By.id("Submit")).click();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.To_From).sendKeys(from);
			driver.findElement(By.id("Toolbar Done Button")).click();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.To_To).sendKeys(to);
			driver.findElement(By.id("Toolbar Done Button")).click();
			Thread.sleep(4000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Flight#")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if flight details are added","flight details are added", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
			}
		}
	}

	// from flight
	public void from_flight(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String flight = queryObjects.getTestData("COFROMFLIGHT");
		System.out.println("fromflight input IS " + flight);
		String date_month = queryObjects.getTestData("COFROMMonth");
		System.out.println("fromflight input IS " + date_month);
		String date_year = queryObjects.getTestData("COFROMYear");
		System.out.println("fromflight input IS " + date_year);
		String date_day = queryObjects.getTestData("COFROMDay");
		System.out.println("fromflight input IS " + date_day);
		String from = queryObjects.getTestData("COFROM_FROM");
		System.out.println("fromflight input IS " + from);
		String to = queryObjects.getTestData("COFROM_TO");
		System.out.println("fromflight input IS " + to);
		if (flight.isEmpty() && date_month.isEmpty() && date_year.isEmpty() && date_day.isEmpty() && from.isEmpty() && to.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "flight function failed", "input passed is empty. Populate it",null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.From_Flight).click();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.From_Flight_No).sendKeys(flight);
			driver.findElement(By.id("Toolbar Done Button")).click();
			driver.findElementByAccessibilityId(Util.compensation_page_objects.From_Date).click();
			
			List <MobileElement> values= driver.findElementsByXPath("//XCUIElementTypePickerWheel");
	           for(int i=0;i<values.size();i++)
	           {
	        	  System.out.println(values.get(i).getText()); 
	           }
	           values.get(0).sendKeys(date_day);
	           values.get(0).sendKeys(Keys.TAB);
	           values.get(1).sendKeys(date_month);
	           values.get(1).sendKeys(Keys.TAB);
	           values.get(2).sendKeys(date_year);
	           values.get(2).sendKeys(Keys.TAB);
	           Thread.sleep(3000);

			driver.findElement(By.id("Submit")).click();

			driver.findElementByAccessibilityId(Util.compensation_page_objects.From_From).sendKeys(from);

			driver.findElementByAccessibilityId(Util.compensation_page_objects.From_To).sendKeys(to);
			driver.findElementByAccessibilityId("additional_copypax").click();
			Thread.sleep(4000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Flight#")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if flight details are added","flight details are added", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
			}
		}
	}

	public void issueCompensation(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueCompensation).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.Click_Ok).click();
		driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
		Thread.sleep(50000);

		try {

			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Print")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if compensation is issued", "compensation issued",null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
		}
	}
	// select all passengers after issue compensation page
	public void afterIssueCompensation_selAll(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElementByAccessibilityId(Util.compensation_page_objects.afterIssueCompensation_selAll).click();
		Thread.sleep(4000);
		try {

			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if copied", "copied to selected passengers", null);

		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
		}
	}

	// select single pax after issue compensation page
	public void afterIssueCompensation_selpax(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
 
		driver.findElementByAccessibilityId(Util.compensation_page_objects.afterIssueCompensation_selpax0).click();
		Thread.sleep(4000);
		try {

			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "passenger is selected", "selected the passenger", null);

		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "Not found", null);
		}
	}

	// select three passengers after issue compensation page
	public void afterIssueCompensation_selthreepax(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElement(By.id(Util.compensation_page_objects.afterIssueCompensation_selpax0)).click();
		driver.findElement(By.id(Util.compensation_page_objects.afterIssueCompensation_selpax1)).click();
		driver.findElement(By.id(Util.compensation_page_objects.afterIssueCompensation_selpax2)).click();
		Thread.sleep(2000);
		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if print page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}

	// Print function after issue compensation
	public void after_Issuecomp_Print(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElement(By.id(Util.compensation_page_objects.afterissuecomp_Print)).click();
		Thread.sleep(59000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			Thread.sleep(10000);
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);

		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.INFO, "Unable to proceed", "page not loaded", null);
		}

	}
	
	// Click email button after issue compensation page
	public void after_Isscomp_Email(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		driver.findElement(By.id(Util.compensation_page_objects.Email)).click();
		Thread.sleep(30000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}
    //click on emd available for print tab
	public void EMD_printList_Available(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		driver.findElementByXPath("//XCUIElementTypeButton[contains(@name, \"EMD Available for Print\")]").click();
		Thread.sleep(6000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}
    //click on emd printed tab
	public void EMD_printed(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{

		driver.findElementByXPath("//XCUIElementTypeButton[contains(@name, \"EMD Printed\")]").click();
		Thread.sleep(6000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}

	
	public void Comp_notissuedtab(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByXPath("//XCUIElementTypeButton[contains(@name, \"Compensation Not Issued\")]").click();
		Thread.sleep(6000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}

	//select passenger in emd available for print tab
	public void sel_Pax_availprint(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.emdavailprint_selpax0).click();
		Thread.sleep(4000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
			// Thread.sleep(10000);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}
	//select  3 passengers in emd available for print tab
	public void sel_Pax3_availprint(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.emdavailprint_selpax0).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.emdavailprint_selpax1).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.emdavailprint_selpax2).click();
		Thread.sleep(4000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}

	}

    //email button in emd available for print tab
	public void emdavailprint_Emailbt(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.emdavailprint_email).click();
		Thread.sleep(15000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}
	}
	//print button in emd available for print tab
	public void emdavailprint_Printbt(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.emdavailprint_print).click();
		Thread.sleep(15000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
		}
	}
    //select 6 passengers in issue compensation page
	public void issue_Sel_6_Pax(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{

		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax0).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax1).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax2).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax3).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax4).click();
		driver.findElementByAccessibilityId(Util.compensation_page_objects.IssueComp_Pax5).click();

		Thread.sleep(15000);

		try {
			new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Name")));
			queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
		} catch (TimeoutException e) {
			TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
			queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);

		}
	}
    //monitery details
	public void Monitery_Input(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException 
	{
		String Monitery = queryObjects.getTestData("COMONITERY_INPUT");
		System.out.println("Meal input IS " + Monitery);
		if (Monitery.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "meal input function failed", "meal input passed is empty. Populate it", null);
		else {
			driver.findElementByAccessibilityId(Util.compensation_page_objects.CompensationMonitaryEMD).click();
		    Thread.sleep(2000);
			driver.findElementByAccessibilityId(Util.compensation_page_objects.Monitery_Input).sendKeys(Monitery);
			driver.findElement(By.id("Toolbar Done Button")).click();
			Thread.sleep(4000);
			try {
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("OK")));
				queryObjects.logStatus(driver, Status.PASS, "Checking if page is loaded", "page is loaded", null);
			} catch (TimeoutException e) {
				TimeUnit.SECONDS.sleep(1); // to wait to get screenshot
				queryObjects.logStatus(driver, Status.FAIL, "Unable to proceed", "page not loaded", null);
			}
		}
	}
    //to adjust host printer settings
	public void settings(IOSDriver driver, BFrameworkQueryObjects queryObjects)
			throws IOException, InterruptedException {
		String OfcName = queryObjects.getTestData("COOfcName");
		System.out.println("input IS " + OfcName);
		if (OfcName.isEmpty())// &&Workstation.isEmpty())
			queryObjects.logStatus(driver, Status.FAIL, "function failed", " input passed is empty. Populate it", null);
		else {
			Thread.sleep(6000);
			driver.findElementByAccessibilityId("Settings").click();
			Thread.sleep(2000);
			driver.findElementByAccessibilityId("settings_host").click();
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
			driver.findElementByAccessibilityId("settings_ofcname").clear();
			driver.findElementByAccessibilityId("settings_ofcname").sendKeys(OfcName);
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
			driver.findElementByAccessibilityId("settings_ofcsearchicon").click();
			driver.findElement(By.id("Toolbar Done Button")).click();
			while (true) {
				if (driver.findElementsByAccessibilityId("IN5CD8220NWL").size() == 0) {
					TouchAction swipe = new TouchAction(driver).press(PointOption.point(511, 650))
							.waitAction(WaitOptions.waitOptions(Duration.ofMillis(1000)))
							.moveTo(PointOption.point(511, 200)).release().perform();
				} else {
					driver.findElementByAccessibilityId("IN5CD8220NWL").click();
					Thread.sleep(2000);
					break;
				}
			}

			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
			driver.findElementByAccessibilityId("ATB1[IN5CD8220NWL]").click();

			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

		}
	}
}
