package Copa;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.aventstack.extentreports.Status;

import FrameworkCode.BFrameworkQueryObjects;
import io.appium.java_client.MobileBy;
import io.appium.java_client.MobileElement;
import io.appium.java_client.ios.IOSDriver;

public class Check_In_Passenger

{            

	public void ClickBag0(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		
		//driver.findElementByAccessibilityId("chk_bag0").click();
		driver.findElementByAccessibilityId(Util.checkin_page_objects.bag_0).click();
		queryObjects.logStatus(driver, Status.INFO, "Clicked on bag for 1st pax", "Clicked Bag", null);
		try
		{
			queryObjects.logStatus(driver, Status.INFO, "Adding Bag for 1st Pax", "ADD baggage Page", null);
			new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("bag_add")));
			String input = queryObjects.getTestData("CIBag0");
			Add_Bag(driver, queryObjects, input);

		}
		catch (Exception e)
		{
			queryObjects.logStatus(driver, Status.INFO, "Clicked on Add Bag", "Can't add bags", null);
		}

	}

	public void Offload(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws InterruptedException, IOException {
		Thread.sleep(5000);
		//driver.findElementByAccessibilityId("btn_offload").click();
		driver.findElementByAccessibilityId(Util.checkin_page_objects.btn_offload).click();
		queryObjects.logStatus(driver, Status.INFO, "taking screen shot", "Can't add bags", null);
	}
	
	public void APIS_CHECK(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws InterruptedException, IOException {
		Thread.sleep(5000);
		//driver.findElementByAccessibilityId("0chk_apis").click();
		driver.findElementByAccessibilityId(Util.checkin_page_objects.chk_apis).click();
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("Check-In")));
		queryObjects.logStatus(driver, Status.INFO, "taking screen shot", "Can't add bags", null);
	}
	public void screen(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws InterruptedException, IOException {
		Thread.sleep(5000);
		queryObjects.logStatus(driver, Status.INFO, "taking screen shot", "Can't add bags", null);
	}
	
	
	public void DeleteBag(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException {

		//driver.findElementByAccessibilityId("chk_bag0").click();
		driver.findElementByAccessibilityId(Util.checkin_page_objects.bag_0).click();
		queryObjects.logStatus(driver, Status.INFO, "Clicked on bag for 1st pax", "Clicked Bag", null);
		try
		{
			queryObjects.logStatus(driver, Status.INFO, "Deleting Bag for 1st Pax", "Trying to delete bag", null);
			new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("bag_add")));
			new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("bag_remove0")));
			driver.findElementByAccessibilityId("bag_remove0").click();

			Thread.sleep(6000);
			driver.findElementByAccessibilityId("bag_submit").click();
			new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("OK")));
			driver.findElementByAccessibilityId("OK").click();
			queryObjects.logStatus(driver, Status.INFO, "deleted the bag", "going to submit", null);
		}
		catch (Exception e)
		{
			queryObjects.logStatus(driver, Status.INFO, "Clicked on Add Bag", "Can't add bags", null);
		}

	}

	public void ClickBag1(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		//driver.findElementByAccessibilityId("chk_bag0").click();
		driver.findElementByAccessibilityId(Util.checkin_page_objects.bag_0).click();
		Thread.sleep(8000);
		String input = queryObjects.getTestData("CIBag1");
		Add_Bag(driver, queryObjects, input);
		queryObjects.logStatus(driver, Status.PASS, "Adding Bag for 1st Pax", "Clicked on Add Bag", null);
	}

	public void Add_Bag(IOSDriver driver,  BFrameworkQueryObjects queryObjects, String input) throws IOException, InterruptedException
	{
		int i = 0;
		Common_funs cf = null;
		//CADULT WALKER,20;SB,12
		String[] bag_obj = input.split(";");

		for(String this_bag : bag_obj)
		{
			String bag_type = this_bag.substring(0, this_bag.indexOf(","));
			String weight = this_bag.substring(this_bag.indexOf(",")+1,this_bag.length());

			if(i>0) //to click on bag add
			{
				new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("bag_add")));
				driver.findElementByAccessibilityId("bag_add").click();
				queryObjects.logStatus(driver, Status.INFO, "Adding Extra Bag", "Clicked Add Extra Bag", null);
			}

			//click on corresponding select product
			new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("bag_select"+i)));
			driver.findElementByAccessibilityId("bag_select"+i).click();
			if(bag_type.startsWith("S")) //for standard bag
			{
				driver.findElementByAccessibilityId("Standard").click();
				queryObjects.logStatus(driver, Status.INFO, "Adding standard Bag", "Clicked Add Extra Bag", null);
			}
			else //this is catalog
			{
				driver.findElementByAccessibilityId("Catalog").click();
				while(true)
				{
					Thread.sleep(6000);
					if (driver.findElementsByAccessibilityId(bag_type.substring(1, bag_type.length())).size() == 0)
					{
						cf.swipe_down_with_XPath(driver, "//XCUIElementTypeSheet[@name=\"Catalog\"]");
					}
					else
					{
						driver.findElementByAccessibilityId(bag_type.substring(1, bag_type.length())).click();
						queryObjects.logStatus(driver, Status.INFO, "Adding Catalog Bag - " + bag_type.substring(1, bag_type.length()), "Added Ctalog Bag", null);
						Thread.sleep(5000);
						break;
					}
				}
			}
			//give weight
			driver.findElementByAccessibilityId("bag_weight"+i).sendKeys(weight);
			//for done
			driver.findElement(By.id("Toolbar Done Button")).click();
			i = i +1;
			driver.findElementByAccessibilityId("bag_submit").click();
			Thread.sleep(6000);
			queryObjects.logStatus(driver, Status.INFO, "Checking if Check-in is loaded", "Check-in is loaded", null);
			try {
				new WebDriverWait(driver, 25).until(ExpectedConditions.presenceOfElementLocated(By.id("Alert")));
				i=i-1;
				queryObjects.logStatus(driver, Status.INFO, "Got alert for Catalog", "Cannot add catalog bag", null);
				driver.findElementByAccessibilityId("OK").click();
				Thread.sleep(2000); //this is to get all elements as active and not blacked out
			}
			catch (Exception e) {
				System.out.println("no alert");
			}
		}
		//In framework give Pass
		//sleep
		new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("bag_continue")));
		queryObjects.logStatus(driver, Status.PASS, "Added All Bags", "Going to give Continue", null);
		driver.findElementByAccessibilityId("bag_continue").click();
		Thread.sleep(15000);
	}

	public void ClickAPISINF(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		Thread.sleep(3000);
		driver.findElementByAccessibilityId("0chk_apis").click();
		String surname = queryObjects.getTestData("CILastName0");
		String givenname = queryObjects.getTestData("CIFirstName0");
		String DOB = queryObjects.getTestData("DOB0");
		String Gender = queryObjects.getTestData("Gender0");
		String CR = queryObjects.getTestData("CR0");
		try {
			new WebDriverWait(driver, 1).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_surname")));
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("chec k");
		}
		String Document = queryObjects.getTestData("Document0");
		String CI = queryObjects.getTestData("CI0");
		String Nationality = queryObjects.getTestData("Nationality0");
		String DocExp = queryObjects.getTestData("DocExp0");
		String PassportNum = queryObjects.getTestData("PassportNum0");
		String ExitDate = queryObjects.getTestData("ExitDate0");
		String Justification = queryObjects.getTestData("Justification0");
		System.out.println("got data from excel");
		Add_ApisINF(driver, queryObjects, surname, givenname, DOB, Gender, CR, Document, CI, Nationality, DocExp, PassportNum,Justification,ExitDate,true);

		//click on the infant name to fill inf details
		driver.findElementByName("apis_passenger1").click();
		Thread.sleep(2000);

		Add_ApisINF(driver, queryObjects, surname, givenname, "11/11/2019", Gender, CR, Document, CI, Nationality, DocExp, PassportNum,Justification,ExitDate,false);
		queryObjects.logStatus(driver, Status.PASS, "Adding APIS for 1st Pax", "APIS ADDED", null);
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_done")));
		driver.findElementByAccessibilityId("apis_done").click();
		Thread.sleep(10000);
	}

	public void Add_ApisINF(IOSDriver driver,  BFrameworkQueryObjects queryObjects, String surname, String givenname, String DOB, String Gender, String CR, String Document, String CI, String Nationality, String DocExp, String PassportNum,String Justification,String ExitDate,Boolean Bypass) throws IOException, InterruptedException
	{
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_surname")));
		queryObjects.logStatus(driver, Status.INFO, "Entered APis page", "Filling apis details", null);
		if(surname.length()>0) {
			//Enter Surname
			driver.findElementByAccessibilityId("apis_surname").sendKeys(surname);
		}
		if(givenname.length()>0) {
			//Enter Given Name
			driver.findElementByAccessibilityId("apis_firstname").sendKeys(givenname);
		}
		if(DOB.length()>0) {
			//Enter Date of Birth
			driver.findElementByAccessibilityId("apis_dob").sendKeys(DOB);
		}
		if(Gender.length()>0) {
			switch (Gender)
			{
			case "M":
				driver.findElementByAccessibilityId("apis_male").click();
				break;
			case "F":
				driver.findElementByAccessibilityId("apis_female").click();
				break;
			}
		}
		if(CR.length()>0) {
			//select Country Of residence
			driver.findElementByAccessibilityId("apis_residence").click();
			MobileElement el3 = (MobileElement)driver.findElementById("Search");
			el3.sendKeys(CR.substring(0, CR.length()-1));
			driver.findElementByAccessibilityId(CR).click();
		}

		if(Document.length()>0) {
			//select document type
			driver.findElementByAccessibilityId("apis_document").click();
			driver.findElementByAccessibilityId(Document).click();
		}
		if(PassportNum.length()>0) {
			//Enter Document Number
			driver.findElementByAccessibilityId("apis_docno").sendKeys(PassportNum);
		}
		if(DocExp.length()>0) {
			//Enter Expiry Date
			driver.findElementByAccessibilityId("apis_expdate").sendKeys(DocExp);
		}
		if(CI.length()>0) {
			//Select Country of Issue
			driver.findElementByAccessibilityId("apis_issue").click();
			MobileElement el4 = (MobileElement)driver.findElementById("Search");
			el4.sendKeys(CI.substring(0, CI.length()-1));
			driver.findElementByAccessibilityId(CI).click();
		}
		if(Nationality.length()>0) {
			//Select Nationality
			driver.findElementByAccessibilityId("apis_nationality").click();
			MobileElement el5 = (MobileElement)driver.findElementById("Search");
			el5.sendKeys(Nationality.substring(0, Nationality.length()-1));
			driver.findElementByAccessibilityId(Nationality).click();
		}
		if(ExitDate.length()>0) {
			//select exit date
			if(driver.findElementByAccessibilityId("apis_justification").isEnabled())
			{
				driver.findElementByAccessibilityId("apis_exitdate").sendKeys(ExitDate);
			}
		}

		if(Justification.length()>0) {
			//Enter Justification
			if(driver.findElementByAccessibilityId("apis_justification").isEnabled()) {
				driver.findElementByAccessibilityId("apis_justification").sendKeys(Justification);
			}

		}

		try {
			driver.findElementById("Toolbar Done Button").click();
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("skip");
		}


		//Checkbox trusted data
		driver.findElementByAccessibilityId("apis_trust").click();

		//purpose of visit
		//driver.findElementByAccessibilityId("apis_visit").click();
		//driver.findElementByAccessibilityId("Business").click();
		Thread.sleep(2000);
		queryObjects.logStatus(driver, Status.INFO, "APis details filled", "Apis done", null);
		try {
			if (Bypass) {
				//ADC BYPASS

				driver.findElementByAccessibilityId("apis_adccheck").click();
				Thread.sleep(2000);
				driver.findElementByAccessibilityId("DOUBLE NATIONALITY").click();
				Thread.sleep(2000);

			}

		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("bypass not done");
		}

		//to submit the APIS
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_submit")));
		driver.findElementByAccessibilityId("apis_submit").click();
		Thread.sleep(7000);
		try {
			new WebDriverWait(driver, 20).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_address")));
			driver.findElementById("apis_address").sendKeys("88767 log entity street");
			Thread.sleep(2000);
			driver.findElementById("Toolbar Done Button").click();
			driver.findElementById("apis_country").click();
			MobileElement el4 = (MobileElement)driver.findElementById("Search");
			el4.sendKeys(CI.substring(0, CI.length()-1));
			driver.findElementByAccessibilityId(CI).click();
			queryObjects.logStatus(driver, Status.INFO, "Destination address entered", "Destination address", null);

		}
		catch (Exception e)
		{
			System.out.println("no destination address required");
			// TODO: handle exception
		}


		Thread.sleep(4000);
		try {
			driver.findElementByAccessibilityId("apis_submit").click();

		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("didnt press done");
		}
		Thread.sleep(7000);

	}

	public void ClickAPIS0(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		Thread.sleep(5000);
		driver.findElementByAccessibilityId("0chk_apis").click();
		String surname = queryObjects.getTestData("CILastName0");
		String givenname = queryObjects.getTestData("CIFirstName0");
		String DOB = queryObjects.getTestData("DOB0");
		String Gender = queryObjects.getTestData("Gender0");
		String CR = queryObjects.getTestData("CR0");
		String Document = queryObjects.getTestData("Document0");
		try {
			new WebDriverWait(driver, 1).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_surname")));
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("chec k");
		}
		String CI = queryObjects.getTestData("CI0");
		String Nationality = queryObjects.getTestData("Nationality0");
		String DocExp = queryObjects.getTestData("DocExp0");
		String PassportNum = queryObjects.getTestData("PassportNum0");
		String ExitDate = queryObjects.getTestData("ExitDate0");
		String Justification = queryObjects.getTestData("Justification0");
		System.out.println("Got data from excel");
		Add_Apis(driver, queryObjects, surname, givenname, DOB, Gender, CR, Document, CI, Nationality, DocExp, PassportNum,Justification,ExitDate,true);
		queryObjects.logStatus(driver, Status.PASS, "Adding APIS for 1st Pax", "APIS ADDED", null);
	}

	public void ClickAPIS1(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		Thread.sleep(3000);
		driver.findElementByAccessibilityId("1chk_apis").click();

		String surname = queryObjects.getTestData("CILastName0");
		String givenname = queryObjects.getTestData("CIFirstName0");
		String DOB = queryObjects.getTestData("DOB0");
		String Gender = queryObjects.getTestData("Gender0");
		String CR = queryObjects.getTestData("CR0");
		String Document = queryObjects.getTestData("Document0");
		try {
			new WebDriverWait(driver, 1).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_surname")));
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("chec k");
		}
		String CI = queryObjects.getTestData("CI0");
		String Nationality = queryObjects.getTestData("Nationality0");
		String DocExp = queryObjects.getTestData("DocExp0");
		String PassportNum = queryObjects.getTestData("PassportNum0");
		String ExitDate = queryObjects.getTestData("ExitDate0");
		String Justification = queryObjects.getTestData("Justification0");
		System.out.println("Got data from excel");
		Add_Apis(driver, queryObjects, surname, givenname, DOB, Gender, CR, Document, CI, Nationality, DocExp, PassportNum,Justification,ExitDate,false);
		queryObjects.logStatus(driver, Status.PASS, "Adding APIS for 1st Pax", "APIS ADDED", null);
	}

	public void Add_Apis(IOSDriver driver,BFrameworkQueryObjects queryObjects, String surname, String givenname, String DOB, String Gender, String CR, String Document, String CI, String Nationality, String DocExp, String PassportNum,String Justification,String ExitDate,Boolean Bypass) throws IOException, InterruptedException
	{
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_surname")));
		queryObjects.logStatus(driver, Status.INFO, "Entered APis page", "Filling apis details", null);
		if(surname.length()>0) {
			//Enter Surname
			driver.findElementByAccessibilityId("apis_surname").sendKeys(surname);
		}
		if(givenname.length()>0) {
			//Enter Given Name
			driver.findElementByAccessibilityId("apis_firstname").sendKeys(givenname);
		}
		if(DOB.length()>0) {
			//Enter Date of Birth
			driver.findElementByAccessibilityId("apis_dob").sendKeys(DOB);
		}
		if(Gender.length()>0) {
			switch (Gender)
			{
			case "M":
				driver.findElementByAccessibilityId("apis_male").click();
				break;
			case "F":
				driver.findElementByAccessibilityId("apis_female").click();
				break;
			}
		}
		if(CR.length()>0) {
			//select Country Of residence
			driver.findElementByAccessibilityId("apis_residence").click();
			MobileElement el3 = (MobileElement)driver.findElementById("Search");
			el3.sendKeys(CR.substring(0, CR.length()-1));
			driver.findElementByAccessibilityId(CR).click();
		}

		if(Document.length()>0) {
			//select document type
			driver.findElementByAccessibilityId("apis_document").click();
			driver.findElementByAccessibilityId(Document).click();
		}
		if(PassportNum.length()>0) {
			//Enter Document Number
			driver.findElementByAccessibilityId("apis_docno").sendKeys(PassportNum);
		}
		if(DocExp.length()>0) {
			//Enter Expiry Date
			driver.findElementByAccessibilityId("apis_expdate").sendKeys(DocExp);
		}
		if(CI.length()>0) {
			//Select Country of Issue
			driver.findElementByAccessibilityId("apis_issue").click();
			MobileElement el4 = (MobileElement)driver.findElementById("Search");
			el4.sendKeys(CI.substring(0, CI.length()-1));
			driver.findElementByAccessibilityId(CI).click();
		}
		if(Nationality.length()>0) {
			//Select Nationality
			driver.findElementByAccessibilityId("apis_nationality").click();
			MobileElement el5 = (MobileElement)driver.findElementById("Search");
			el5.sendKeys(Nationality.substring(0, Nationality.length()-1));
			driver.findElementByAccessibilityId(Nationality).click();
		}
		if(ExitDate.length()>0) {
			//select exit date
			if(driver.findElementByAccessibilityId("apis_justification").isEnabled())
			{
				driver.findElementByAccessibilityId("apis_exitdate").sendKeys(ExitDate);
			}
		}

		if(Justification.length()>0) {
			//Enter Justification
			if(driver.findElementByAccessibilityId("apis_justification").isEnabled()) {
				driver.findElementByAccessibilityId("apis_justification").sendKeys(Justification);
			}

		}

		try {
			driver.findElementById("Toolbar Done Button").click();
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("skip");
		}


		//Checkbox trusted data
		driver.findElementByAccessibilityId("apis_trust").click();

		//purpose of visit
		//driver.findElementByAccessibilityId("apis_visit").click();
		//driver.findElementByAccessibilityId("Business").click();
		Thread.sleep(2000);
		queryObjects.logStatus(driver, Status.INFO, "APis details filled", "Apis done", null);
		try {
			if (Bypass) {
				//ADC BYPASS

				driver.findElementByAccessibilityId("apis_adccheck").click();
				Thread.sleep(2000);
				driver.findElementByAccessibilityId("DOUBLE NATIONALITY").click();
				Thread.sleep(2000);

			}
		} catch (Exception e) {
			System.out.println("by pass not done");
		}


		//to submit the APIS
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_submit")));
		driver.findElementByAccessibilityId("apis_submit").click();
		Thread.sleep(7000);
		try {
			new WebDriverWait(driver, 20).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_address")));
			driver.findElementById("apis_address").sendKeys("88767 log entity street");
			Thread.sleep(2000);
			driver.findElementById("Toolbar Done Button").click();
			driver.findElementById("apis_country").click();
			MobileElement el4 = (MobileElement)driver.findElementById("Search");
			el4.sendKeys(CI.substring(0, CI.length()-1));
			driver.findElementByAccessibilityId(CI).click();
			queryObjects.logStatus(driver, Status.INFO, "Destination address entered", "Destination address", null);

		} catch (Exception e) {
			System.out.println("no destination address required");
			// TODO: handle exception
		}


		Thread.sleep(4000);
		try {
			driver.findElementByAccessibilityId("apis_submit").click();

		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("didnt press done");
		}
		Thread.sleep(7000);

		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("apis_done")));
		driver.findElementByAccessibilityId("apis_done").click();
		Thread.sleep(10000);
	}

	public void APIS_Emergency_Contact(IOSDriver driver,  BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException {
		String Emergency_name = queryObjects.getTestData("EmergencyCName");
		//Emergency Contact name
		driver.findElementByAccessibilityId("apis_contact").sendKeys(Emergency_name);
		String Emergency_num = queryObjects.getTestData("EmergencyCNum");
		//Emergency contact Phone Number
		driver.findElementByAccessibilityId("apis_phoneno").sendKeys(Emergency_num);
		//Check Box apply for all PNR passengers
		driver.findElementByAccessibilityId("apis_applyall").click();
		queryObjects.logStatus(driver, Status.PASS, "Adding APIS for 1st Pax", "APIS ADDED", null);
	}

	public void ClickSeat0(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String seat_type = queryObjects.getTestData("Seat0");
		String[] seat_obj = seat_type.split(";");
		for(String seat : seat_obj)
		{
			driver.findElementByAccessibilityId("chk_seat0").click();
			//new block to take screenshots while waiting for seat selection screen to load
			int count = 0;
			while(true) 
			{
				if(driver.findElementsByName("Seat Selection").size()==0)
				{
					Thread.sleep(750);
					queryObjects.logStatus(driver, Status.INFO, "searching","toast message", null);
					count=count+1;
					if(count>6)
						break;
				}
				else
					break;
			}
			//end of new loop

			try
			{
				new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.name("Seat Selection")));
				Select_Seat(driver, queryObjects, seat);
			}
			catch (Exception e)
			{
				queryObjects.logStatus(driver, Status.PASS, "Seat selection didn't load", "ESTA Passenger / non CM flight", null);
			}
		}
		Thread.sleep(2000);
		queryObjects.logStatus(driver, Status.PASS, "Selecting Seat for 1st Pax", "Clicked on Seat Selection", null);
	}

	public void Select_Seat(IOSDriver driver,  BFrameworkQueryObjects queryObjects, String seat_type) throws IOException, InterruptedException
	{
		System.out.println("Seat is : " + seat_type);
		Thread.sleep(6000);
		List<MobileElement> avail_seats = null;
		boolean seat_matched = false;
		if(seat_type.equals("B"))
			avail_seats=driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, '//availableSeat/Business')]");
		else if(seat_type.equals("V"))
			avail_seats=driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, '/V/availableSeat/Economy')]");
		else if(seat_type.equals("E"))
			avail_seats=driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, '/E/availableSeat/Economy')]");
		else if(seat_type.equals("T"))
			avail_seats=driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, '/T/availableSeat/Economy')]");
		else if(seat_type.equals("J"))
			avail_seats=driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, '/J/availableSeat/Economy')]");
		else if(seat_type.equals("Z"))
			avail_seats=driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, '/Z/availableSeat/Economy')]");
		else if(seat_type.equals("A"))
			avail_seats=driver.findElementsByXPath("//XCUIElementTypeButton[contains(@name, '//availableSeat/Economy')]");
		//XCUIElementTypeButton[@name="seat_20C//availableSeat/Economy"]


		System.out.println(avail_seats.size() + " , " + seat_type);
		if(avail_seats.size()>0) //any apt seats found
		{
			avail_seats.get(0).click();
			seat_matched = true;
			Thread.sleep(5000);
			driver.findElementByAccessibilityId("seat_submit").click();
			//new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("seat_continue")));
			Thread.sleep(20000);
		}
		else
		{
			System.out.println("No Seats Selected. Nothing was availble");
		}

		if(seat_matched == true)
			queryObjects.logStatus(driver, Status.INFO, "Requested seat of type " + seat_type, "Seat assigned", null);
		else
			queryObjects.logStatus(driver, Status.INFO, "Requested seat type " + seat_type + " not assigned", "ESTA PAX / SEAT NOT AVAILABLE / SEAT BLOCKED", null);
		driver.findElementByAccessibilityId("seat_continue").click();
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("btn_checkin")));
	}

	public void Click_FQTV0(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		String FQTV_No = queryObjects.getTestData("FQTV");
		String FQTV_CODE = queryObjects.getTestData("FQTV_CODE");
		System.out.println(FQTV_No);
		driver.findElementByAccessibilityId("chk_fqtv0").click();
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.name("Airline Code/Program Name")));
		//Thread.sleep(10000);
		Enter_FQTV(driver, queryObjects, FQTV_No, FQTV_CODE);
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("btn_checkin")));
		queryObjects.logStatus(driver, Status.PASS, "FQTV number is added", "FQTV added", null);
	}

	public void Enter_FQTV(IOSDriver driver, BFrameworkQueryObjects queryObjects, String FQTV_No,String FQTV_CODE) throws IOException, InterruptedException
	{
		if (FQTV_CODE.length()>0) {
			driver.findElementByAccessibilityId("airline_code").click();
			Thread.sleep(5000);
			while(true) {
				if (driver.findElementsByAccessibilityId(FQTV_CODE).size()==0)
				{
					Checkin_FQTV_swipeside_down(driver, queryObjects);
				}
				else
				{
					Thread.sleep(2000);
					driver.findElementByAccessibilityId(FQTV_CODE).click();
					break;

				}
			}
		}
		driver.findElementByAccessibilityId("fqtv_num").sendKeys(FQTV_No);
		driver.findElement(By.id("Toolbar Done Button")).click();
		//click on submit
		Thread.sleep(5000);
		driver.findElementByAccessibilityId("fqtv_submit").click();


		try {
			new WebDriverWait(driver, 20).until(ExpectedConditions.presenceOfElementLocated(By.id("OK")));
			driver.findElementById("OK").click();
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Baggage cleared due to fqtv change");
		}

		//wait until check-in button in the check-in screen
		new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("btn_checkin")));
	}

	public void ClickPax0(IOSDriver driver, BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		Thread.sleep(4000);
		driver.findElementByAccessibilityId("checkin_passenger0").click();
		//Do_Checkin(driver, queryObjects);
		queryObjects.logStatus(driver, Status.PASS, "Clicking Pax for 1st Pax", "Clicked on Add Bag", null);
		Thread.sleep(10000);
	}

	public void Do_Checkin(IOSDriver driver,  BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{
		driver.findElementByAccessibilityId("btn_checkin").click();
		int count=0;
		//take screen
		while(true) {
			//element is found
			if(driver.findElementsById("boardingPass").size()!= 1)     
			{             
				Thread.sleep(130);
				queryObjects.logStatus(driver, Status.INFO, "searching","toast message", null);
				count=count+1;
				if(count>40)
					break;
			}
			else {
				break;
			}
		}
		while(true) {
			//element is found
			Thread.sleep(500);
			queryObjects.logStatus(driver, Status.INFO, "searching","toast message", null);
			count=count+1;
			if(count>4)
				break;

		}
		try
		{
			new WebDriverWait(driver, 30).until(ExpectedConditions.presenceOfElementLocated(By.id("boardingPass")));
			queryObjects.logStatus(driver, Status.PASS, "Checked in passenger", "Checked in passenger", null);
			Thread.sleep(2000); //this is to get all elements as active and not blacked out
		}
		catch (Exception e)
		{
			queryObjects.logStatus(driver, Status.INFO, "Check-in passenger", "Didn't Check-in passenger", null);
			System.out.println("no alert");
		}

		Thread.sleep(10000);
		//new WebDriverWait(driver, 60).until(ExpectedConditions.elementToBeClickable(By.id("btn_checkin")));
		//                            new WebDriverWait(driver, 60).until(ExpectedConditions.presenceOfElementLocated(By.id("btn_checkin")));
	}

	public void Do_Boarding(IOSDriver driver,  BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException {

		driver.findElementByAccessibilityId("boardingPass").click();
		int count = 0 ;
		while(true) {
			//element is found
			Thread.sleep(500);
			queryObjects.logStatus(driver, Status.INFO, "searching","toast message", null);
			count=count+1;
			if(count>15)
				break;

		}

		queryObjects.logStatus(driver, Status.PASS, "Boarded passenger", "Passenger boarded", null);
		Thread.sleep(10000);
	}

	public void Checkin_swipeside_left(IOSDriver driver,  BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		//RemoteWebElement parent = (RemoteWebElement)driver.findElement(By.xpath("//XCUIElementTypeScrollView[@name=\"checkin_scroll\"]")); //identifying the parent Table
		RemoteWebElement parent = (RemoteWebElement)driver.findElement(By.xpath(Util.checkin_page_objects.checkin_scroll)); //identifying the parent Table
		String parentID = parent.getId();
		HashMap<String, String> scrollObject = new HashMap<String, String>();
		scrollObject.put("element", parentID);
		scrollObject.put("direction", "left");
		driver.executeScript("mobile:swipe", scrollObject);
		Thread.sleep(3000);
		queryObjects.logStatus(driver, Status.PASS, "Swiping left", "Viewed pervious flight", null);
	}

	public void Checkin_swipeside_right(IOSDriver driver,  BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException{
		//RemoteWebElement parent = (RemoteWebElement)driver.findElement(By.xpath("//XCUIElementTypeScrollView[@name=\"checkin_scroll\"]")); //identifying the parent Table
		RemoteWebElement parent = (RemoteWebElement)driver.findElement(By.xpath(Util.checkin_page_objects.checkin_scroll)); //identifying the parent Table
		String parentID = parent.getId();
		HashMap<String, String> scrollObject = new HashMap<String, String>();
		scrollObject.put("element", parentID);
		scrollObject.put("direction", "right");
		driver.executeScript("mobile:swipe", scrollObject);
		Thread.sleep(3000);
		queryObjects.logStatus(driver, Status.PASS, "Swiping right", "Viewed next flight", null);
	}

	public void Checkin_FQTV_swipeside_down(IOSDriver driver,BFrameworkQueryObjects queryObjects) throws IOException, InterruptedException
	{

		//RemoteWebElement parent = (RemoteWebElement)driver.findElement(By.xpath("//XCUIElementTypeApplication[@name=\"COPA Airport\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeTable")); //identifying the parent Table
		
		RemoteWebElement parent = (RemoteWebElement)driver.findElement(By.xpath(Util.checkin_page_objects.fqtv_carrier)); //identifying the parent Table
		String parentID = parent.getId();
		HashMap<String, String> scrollObject = new HashMap<String, String>();
		scrollObject.put("element", parentID);
		scrollObject.put("direction", "up");
		driver.executeScript("mobile:swipe", scrollObject);
		Thread.sleep(3000);
		queryObjects.logStatus(driver, Status.PASS, "Swiping down", "Searching for airline code", null);
	}
}