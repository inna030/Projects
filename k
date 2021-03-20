from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

ACCOUNT_EMAIL = "inna030030@gmail.com"
ACCOUNT_PASSWORD = "Icedcocoa030."
path="/Users/innalu/Documents/Selenium/chromedriver"
driver=webdriver.Chrome(executable_path=path)
driver.get("https://www.linkedin.com/jobs/search/?f_AL=true&f_L=New%20York%2C%20United%20States&geoId=105080838&keywords=%20intern&location=New%20York%2C%20United%20States")
time.sleep(2)
sign_in_button = driver.find_element_by_link_text("Sign in")
sign_in_button.click()
time.sleep(2)
email_field = driver.find_element_by_id("username")
email_field.send_keys(ACCOUNT_EMAIL)
password_field = driver.find_element_by_id("password")
password_field.send_keys(ACCOUNT_PASSWORD)
password_field.send_keys(Keys.ENTER)
#doc_link=driver.find_element_by_css_selector(".documentation-widget a")
#print(doc_link.text)
#driver.close()
time.sleep(5)
all_listings = driver.find_elements_by_css_selector(".job-card-list__title")
for listing in all_listings:
    print("called")
    listing.click()
    time.sleep(2)
    try:
        apply_button = driver.find_element_by_css_selector(".artdeco-button__icon--in-bug")
        apply_button.click()
        time.sleep(2)
        submit_button = driver.find_element_by_css_selector("footer button")
        submit_button.click()
        continue
        #submit_button.click()
    except NoSuchElementException:
        print("No application button, skipped.")
        continue

time.sleep(5)
driver.quit()
#driver.quit()
