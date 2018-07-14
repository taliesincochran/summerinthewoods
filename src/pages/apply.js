import React from 'react'
import Helmet from 'react-helmet'
import { Redirect } from "react-router-dom"
// import Moment from 'react-moment'
import { db } from '../firebase'
import Link from 'gatsby-link'
import BannerLanding from '../components/BannerLanding/'
import Checkbox from '../components/Checkbox'
import Input from '../components/Input'

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            month: '',
            year: '',
            yearsArray: '',
            chosenYear: '',
            numberOfChildren: 1,
            totalCost: 0,
            amountDue: 0,
            savings: 0,
            campTimezoneOffset: 4,
            localTimezoneOffset: '',
            campTimes: '',
            rawCampTimes:'',
            Week1: 0,
            Week2: 0,
            Week3: 0,
            Week4: 0,
            Week5: 0,
            Week6: 0,
            Week7: 0,
            Week8: 0,
            weekArray: [],
            childFirstName:'',
            childLastName:'',
            age:'',
            birthday:'',
            allergies:'',
            parent1Name:'',
            parent1Phone: '',
            parent2Name:'',
            parent2Phone:'',
            emergency1Name:'',
            emergency1Relationship:'',
            emergency1Phone:'',
            emergency2Name:'',
            emergency2Relationship:'',
            emergency2Phone:'',
            physicianName:'',
            physicianPhone:'',
            dentistName:'',
            dentistPhone:'',
            address:'',
            option:'',
            firstWeek:0,
            paypalCost: 0,
            page:0,
            buttonHash:''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleYearSelect = this.handleYearSelect.bind(this)
        this.handleWeekSelect = this.handleWeekSelect.bind(this)
        this.getWeeks =  this.getWeeks.bind(this)
        this.handleTelephoneNumber = this.handleTelephoneNumber.bind(this)
    }
    componentDidMount() {
        if(this.props.location.state) {
            let {year, month, date, yearsArray,chosenYear,campTimes,rawCampTimes,localTimezoneOffset} = this.props.location.state;
            this.setState({year, month, date, yearsArray,chosenYear,campTimes,rawCampTimes,localTimezoneOffset})
            this.setState({weekArray: this.getWeeks(this.props.location.state.rawCampTimes[this.props.location.state.chosenYear],this.props.location.state.chosenYear)}) 
        }
    }
    getWeeks (yearChosen, yearString) {
        let weekArray = [];
        let year = yearString;
        for(let weekChosen in yearChosen) {
            let week = weekChosen;
            week.split('').splice(4,0," ").join('');
            let { start, end, available, pending, noCamp } = yearChosen[week]
            start = new Date(start);
            start = start.getMonth() + "/" + start.getDate();
            end = new Date(end);
            end = end.getMonth() + "/" + end.getDate();

            weekArray.push({week,year,start,end,available,pending,noCamp})
        }
        return weekArray
    }
    handleChange = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }
    handleTelephoneNumber = e => {
        let { name, value } = e.target;
        let temp = ''
        console.log("handleTelephoneNumber", "length", value.length, "slice", value.slice(-1), this.state[name].slice(-1))
        console.log("name", name, "value", value, "state", this.state[name])
        if(this.state[name].length < 14 && !isNaN(parseInt(value.slice(-1)))) {
            if(this.state[name].length > value.length || value.slice(-1) == ")" || value.slice(-1) == "(" || value.slice(-1) =="-") {
                temp = value.slice(0,value.length - 1)
                console.log("temp0", temp)
            } else if(this.state[name].length == 0 && value.length == 1 && this.state[name].indexOf("(") == -1) {
                temp = "(" + value.toString();
                console.log("temp1", temp);
            } else if(this.state[name].length == 3 && this.state[name].indexOf(")") == -1) {
               temp = value.toString() + ")";
               console.log("temp2", temp);
            } else if(this.state[name].length == 7 && this.state[name].indexOf("-") == -1 && this.state[name].length < value.length) {
                temp = value.toString() + "-";
                console.log("temp3", temp);
            } else if(this.state[name].length == 13 && value.length == 14) {
                temp = this.state[name].slice(0,this.state[name].length)
            } else {
                temp = value;
                console.log("tempOther", temp)
            }
        } else if (this.state[name].length == 1 && value == "") {
            temp = "";
        }
        this.setState({ [name]: temp });
    }
    handleYearSelect = year => {
        this.setState({ chosenYear : year, weekArray: this.getWeeks(this.state.rawCampTimes[year], year), Week1: 0, Week2:0, Week3: 0, Week4:0, Week5:0, Week6:0, Week7:0, Week8:0, firstWeek:0, totalCost:0, amountDue:0, paypalCost:0}, ()=>{this.getCost()})
    }
    getButtonHash = (firstWeek) => {
        let buttonHash = "";
        switch(firstWeek) {
            case 1:
                buttonHash="HFZLESBQRMT78";
                break;
            case 2: 
                buttonHash="C7RB9N4NF448S";
                break;
            case 3:
                buttonHash="UWCSQW5Y5GGUG";
                break;
            case 4: 
                buttonHash="K9YMLSATDL24A";
                break;
        }
        this.setState({buttonHash})
    }
    handleSubmit = event => {
        event.preventDefault();
        let { childFirstName, childLastName, age, birthday, allergies, parent1Name, parent1Phone, parent2Name, parent2Phone, emergency1Name, emergency1Relationship, emergency1Phone, emergency2Name, emergency2Relationship, emergency2Phone, physicianName, physicianPhone, dentistName, dentistPhone, address, localTimezoneOffset, chosenYear} = this.state;
        let key = chosenYear + "_" + childFirstName + "_" + childLastName + "_" + age;
        let application = { childFirstName, childLastName, age, birthday, allergies, parent1Name, parent1Phone, parent2Name, parent2Phone, emergency1Name, emergency1Relationship, emergency1Phone, emergency2Name, emergency2Relationship, emergency2Phone, physicianName, physicianPhone, dentistName, dentistPhone, address, localTimezoneOffset, key }
        db.applicationSubmit(application);   
    }
    handleNext = event => {
        event.preventDefault();
        switch(event.target.id) {
            case 'previousPage0':
                this.setState({page:0});
                break;
            case 'submitPage0':
                this.state.firstWeek !==0?
                    this.setState({page: 1, error0:""}):
                    this.setState({error0: "Please select at least one week."});
                break;
            case 'previousPage1':
                this.setState({page: 1});
                break;
            case 'submitPage1':
                (this.state.childFirstName && this.state.childLastName && this.state.age && this.state.birthday)?
                    this.setState({page:2, error1: ""}):
                    this.setState({error1: "Please fill out all required fields."});
                break;
            case 'previousPage2':
                this.setState({page: 2});
                break;
            case 'submitPage2':
                (this.state.parent1Phone && this.state.parent1Name && this.state.address)?
                    this.setState({page:3, error2: ''}):
                    this.setState({error2: "Please fill out all required fields."});
                break;
            case 'previousPage3':
                this.setState({page: 3});
                break;
            case 'submitPage3':
                (this.state.emergency1Name && this.state.emergency2Name && this.state.emergency1Phone && this.state.emergency2Phone && this.state.emergency1Relationship && this.state.emergency2Relationship)?
                    this.setState({page:4, error3: ''}):
                    this.setState({error3: "Please fill out all required fields."});
                break;
            case 'submitPage4':
                (this.state.physicianPhone && this.state.physicianName && this.state.dentistPhone && this.state.dentistName)?
                    this.setState({page:5, error4: ''}):
                    this.setState({error4: "Please fill out all required fields."})
                break;
            case 'previousPage4':
                this.setState({page:4});
                break;

        }
    }
    handleWeekSelect = (week, value) => {
        if(this.state[week] == value) {
            this.setState({[week]: 0}, ()=>this.getCost())
        } 
        else {
            this.setState({[ week ]: value},() => this.getCost());    
        }
    }
    makeWeekArray = () => {
        let weekArray = [this.state.Week1, this.state.Week2, this.state.Week3, this.state.Week4, this.state.Week5, this.state.Week6, this.state.Week7, this.state.Week8];
        return weekArray  
    }
    getCost = () => { 
        let weekArray = this.makeWeekArray()
        console.log("weeks selected", weekArray)
        let firstWeekSelected = 0;
        let totalWeeksSelected = 0;
        for(var i = 0; i<weekArray.length; i++) {
            if(weekArray[i] !== 0) {
                firstWeekSelected= weekArray[i];
                break
            }
        }
        for(var i = 0; i<weekArray.length; i++) {
            if(weekArray[i] !== 0) {
                totalWeeksSelected++;
            }
        }
        let threeDayArray = weekArray.filter(value => value === 3)
        let threeDayCost = 120 * threeDayArray.length
        let fiveDayArray = weekArray.filter(value => value === 5)
        let fiveDayCost = 0;
        let initialCost = 0;
        let fiveDayNumber = fiveDayArray.length
        let savings = 0;
        let firstWeek=0;
        if(fiveDayNumber>5) {
            fiveDayCost = 135 * fiveDayArray.length;
            initialCost = 135;
            savings = 40 * fiveDayArray.length;
            firstWeek = 4;
            this.getButtonHash(2);
        } else if(fiveDayNumber> 3) {
            fiveDayCost = 150 * fiveDayArray.length;
            initialCost = 150;
            savings = 25 * fiveDayArray.length;
            firstWeek=3;
            this.getButtonHash(3);
        } else if(fiveDayNumber) {
            fiveDayCost = 175 * fiveDayArray.length;
            initialCost = 175;
            firstWeek=2;
            this.getButtonHash(4)
        } else if (!fiveDayNumber && totalWeeksSelected) {
            initialCost = 120;
            firstWeek=1;
            this.getButtonHash(1)
        }
        let totalCost = fiveDayCost + threeDayCost;
        let test = weekArray.filter(value => value=== 0);
        console.log("test",test.length, weekArray.length)
        let amountDue = 0;
        if(test.length == weekArray.length) {
            amountDue=0;
        }
        else {
            amountDue = initialCost + (totalWeeksSelected - 1) * 25;
        }
        let paypalCostUnrounded = (amountDue * 1.029) +.3;
        let paypalTemp = 100 * paypalCostUnrounded;
        let paypalCost = (Math.round(paypalTemp)/100).toFixed(2);
        console.log("amountDue", amountDue);
        console.log("paypal cost", paypalCostUnrounded, paypalTemp, paypalCost)
        this.setState({totalCost, amountDue, savings, firstWeek, paypalCost});
    }
    render() {
        return(
        !this.props.location.state?<Redirect to="/"/>:
                <div>
                    <Helmet>
                        <title>Summer In The Woods</title>
                        <meta name="description" content="Application Page" />
                    </Helmet>
                    <div id="main">
                        <div className="inner">
                            <section>
                                <form>
                                    <h1>Application</h1>
                                    {this.state.page == 0?
                                        <div>
                                            <p>To reserve your child’s spot, please submit this completed htmlForm and a deposit of your first week’s payment
                                                plus $25 per additional week. The waiver can be signed once you have visited our location.  Payments can be paid via Paypal, but a 0.29% +$.30 service charge will be added to cover the added expense to the camp. 
                                            </p>
                                            <div>
                                                <p>Year</p>
                                                <div className="yearBox">
                                                <h2>Select the weeks you would your child to attend.</h2>
                                                <h2>Total Amount Due To Reserve Selected Weeks: ${this.state.amountDue}</h2>
                                                {this.props.location.state.yearsArray.length > 1?
                                                    <div>
                                                        <Checkbox name="year1" value={this.props.location.state.yearsArray[0]} onChange={this.handleYearSelect} checked={this.state.chosenYear == this.props.location.state.yearsArray[0]} className='float-left' value={this.props.location.state.yearsArray[0]} onClick={() => this.handleYearSelect(this.props.location.state.yearsArray[0])} text={this.props.location.state.yearsArray[0]} />
                                                        <Checkbox type="checkbox" name="year2" value={this.props.location.state.yearsArray[1]} onChange={this.handleYearSelect} checked={this.state.chosenYear == this.props.location.state.yearsArray[1]} className='float-left' value={this.props.location.state.yearsArray[0]} onClick={() => this.handleYearSelect(this.props.location.state.yearsArray[1])} text={this.props.location.state.yearsArray[1]} />
                                                    </div>
                                                :
                                                    <div>
                                                        <Checkbox name="year1" value={this.props.location.state.yearsArray[0]} onChange={this.handleYearSelect} checked={true} className='float-left' value={this.props.location.state.yearsArray[0]} onClick={() => this.handleYearSelect(this.props.location.state.yearsArray[0])} text={this.props.location.state.yearsArray[0]} />
                                                    </div>
                                                }
                                                </div>
                                                <div className="infoBox">
                                                {this.state.weekArray.map((week,i)=>
                                                    week.noCamp?
                                                    <div key ={week.week} className='smallBox'>
                                                        <p style={{fontSize:"1.5em"}}>{week.start}-{week.end}<br/> No Camp This Week</p>
                                                    </div>:
                                                    <div key = {week.week} className='smallBox'>
                                                        <p style={week.available-week.pending>0?{fontSize: "1.5em"}:{fontSize:"1.5em",textDecoration:"line-through"}}>{week.start}-{week.end} <br/>Spots Available: {week.available - week.pending}</p>
                                                        {(week.available - week.pending)>0?
                                                            <div key={i}>
                                                                <Checkbox name={`"${week.week}5"`} value="5" onChange={()=>this.handleWeekSelect(week.week, 5)} checked={this.state[week.week] == "5"} onClick={()=> this.handleWeekSelect(week.week, 5)} text="5 day" />
                                                                <Checkbox name={`"${week.week}3"`} value='3' onChange={()=>this.handleWeekSelect(week.week, 5)} checked={this.state[week.week] == "3"} onClick={()=> this.handleWeekSelect(week.week, 3)} text="3 day" />
                                                            </div>
                                                            :
                                                            <div key={i}>
                                                                <Checkbox labelStyle={{textDecoration: 'line-through'}} disabled={true} name={`"${week.week}5"`} value="5" onChange={()=>this.handleWeekSelect(week.week, 0)} checked={false} value='0' onClick={()=> this.handleWeekSelect(week.week, 5)} text="5 day" />
                                                                <Checkbox disabled={true} labelStyle={{textDecoration: 'line-through'}} name={`"${week.week}3"`} value='5' onChange={()=>this.handleWeekSelect(week.week, 0)} checked={false} value='0' onClick={()=> this.handleWeekSelect(week.week, 3)} text="3 day" />
                                                            </div>
                                                        }
                                                    </div>                                                
                                                )}
                                                </div>
                                                <p>{this.state.error0}</p>
                                                <button className="button" id="submitPage0" onClick={this.handleNext}>Next</button>
                                            </div> 
                                        </div>
                                    :this.state.page == 1?
                                        <div>
                                            <h2>Total Amount Due To Reserve Selected Weeks: ${this.state.amountDue}</h2>
                                            <h2>Child's Information</h2>
                                            <div className="infoBox">                           
                                                <Input className="field half first" text="Child's First Name" type="text" name="childFirstName" placeholder="required" required={true} onChange={this.handleChange} value={this.state.childsFirstName} value={this.state.childFirstName} />
                                                <Input className="field half" text="Child's Last Name" type="text" name="childLastName" placeholder="required" required={true} onChange={this.handleChange} value={this.state.childLastName} />
                                                <Input className="field half first" text="Age" type="number" name="age" placeholder="required" required={true} onChange={this.handleChange} value={this.state.age} />
                                                <Input className="field half" text="Birthdate" type="date" name="birthday" placeholder="required" required={true} onChange={this.handleChange}  value={this.state.birthday}/>                                            
                                                <div className="field">
                                                    <label htmlFor="allergies">Allergies</label>
                                                    <textarea name="allergies" rows="6" onChange={this.handleChange} value={this.state.allergies}></textarea>
                                                </div>
                                            </div>
                                            <p>{this.state.error1}</p>
                                            <button className="button" id="previousPage0" onClick={this.handleNext}>Previous</button>
                                            <button className="button nextPage" id="submitPage1" onClick={this.handleNext}>Next</button>
                                        </div>
                                    :this.state.page == 2?
                                        <div>
                                            <h2>Total Amount Due To Reserve Selected Weeks: ${this.state.amountDue}</h2>
                                            <h2>Parent Information</h2>
                                            <div className="infoBox">
                                                <div className='smallBox'>
                                                    <p  className="formText">Parent 1</p>  
                                                    <Input className="field half first" text="Parent or Guardian's Name" type="text" name="parent1Name" placeholder="required" required={true} onChange={this.handleChange} value={this.state.parent1Name} value={this.state.parent1Name} />
                                                    <Input className="field half" text="Parent or Guardian's Phone Number" type="tel" name="parent1Phone" placeholder="required" required={true} onChange={this.handleTelephoneNumber} value={this.state.parent1Phone}  value={this.state.parent1Phone}/>
                                                </div>
                                                <p  className="formText">Parent 2</p>
                                                <div className="smallBox">
                                                    <Input className="field half first" text="Parent or Guardian's Name" type="text" name="parent2Name" onChange={this.handleChange}  value={this.state.parent2Name}/>
                                                    <Input className="field half" text="Parent or Guardian's Phone Number" type="tel" name="parent2Phone" onChange={this.handleTelephoneNumber} value={this.state.parent2Phone}/>
                                                </div>
                                                <div className="field">
                                                    <label htmlFor="address">Address</label>
                                                    <textarea name="address" rows="4"  required onChange={this.handleChange}  value={this.state.address}></textarea>
                                                </div>
                                            </div>
                                            <p>{this.state.error2}</p>
                                            <button className="button" id="previousPage1" onClick={this.handleNext}>Previous</button>
                                            <button className="button nextPage" id="submitPage2" onClick={this.handleNext}>Next</button>
                                        </div>          
                                    :this.state.page == 3?
                                        <div>
                                            <h2>Total Amount Due To Reserve Selected Weeks: ${this.state.amountDue}</h2>
                                            <h2>Emergency Information</h2>
                                            <div className="infoBox">
                                                <div className="smallBox">
                                                    <p className="infoText">List two other contacts who will assume temporary care of your child if you cannot be reached</p>
                                                    <p className="formText">Contact 1</p>
                                                    <Input className="field half first" text="Contact's Name" type="text" name="emergency1Name" placeholder="required" required={true} onChange={this.handleChange}  value={this.state.emergency1Name}/> 
                                                    <Input className="field half" text="Contact's Phone Number" type="tel" name="emergency1Phone" placeholder="required" required={true} onChange={this.handleTelephoneNumber}  value={this.state.emergency1Phone}/>
                                                    <Input className="field half" text="Contact's Relationship" type="text" name="emergency1Relationship" placeholder="required" required={true} onChange={this.handleChange}  value={this.state.emergency1Relationship}/>
                                                </div>
                                                <p className="formText">Contact 2</p>
                                                <div className="smallBox">
                                                    <div style={{height:'5px'}} />
                                                    <Input className="field half first" text="Contact's Name" type="text" name="emergency2Name"  placeholder="required" required={true} onChange={this.handleChange}  value={this.state.emergency2Name}/>
                                                    <Input className="field half" text="Contact's Phone Number" type="tel" name="emergency2Phone"  placeholder="required" required={true} onChange={this.handleTelephoneNumber}  value={this.state.emergency2Phone}/>
                                                    <Input className="field half" text="Contact's Relationship" type="text" name="emergency2Relationship" placeholder="required" required={true} onChange={this.handleChange}  value={this.state.emergency2Relationship} />
                                                </div>
                                            </div>
                                            <p>{this.state.error3}</p>
                                            <button className="button" id="previousPage2" onClick={this.handleNext}>Previous</button>
                                            <button className="button nextPage" id="submitPage3" onClick={this.handleNext}>Next</button>
                                        </div>
                                    :this.state.page== 4 ?
                                        <div>
                                            <h2>Total Amount Due To Reserve Selected Weeks: ${this.state.amountDue}</h2>
                                            <h2>Physician and Dentist Information</h2>
                                                <div className="infoBox">
                                                    <Input className="field half first" text="Physician's Name" type="text" name="physicianName" placeholder="required" required={true} onChange={this.handleChange}  value={this.state.physicianName}/>
                                                    <Input className="field half" text="Physician's Number" type="tel" name="physicianPhone" placeholder="required" required={true} onChange={this.handleTelephoneNumber} value={this.state.physicianPhone} />
                                                    <Input className="field half first" text="Dentist's Name" type="text" name="dentistName"  placeholder="required" required={true} onChange={this.handleChange} value={this.state.dentistName} />
                                                    <Input className="field half" text="Dentists's Number" type="tel" name="dentistPhone" placeholder="required" required={true} onChange={this.handleTelephoneNumber} value={this.state.dentistPhone} />                                            
                                                </div>
                                                <p>{this.state.error4}</p>
                                                <button className="button" id="previousPage3" onClick={this.handleNext}>Previous</button>
                                            <button className="button nextPage" id="submitPage4" onClick={this.handleSubmit}>Next</button>
                                        </div>
                                    :
                                        <div>
                                           <h2>Total Amount Due To Reserve Selected Weeks: ${this.state.amountDue}</h2>
                                           <h3>Total Cost: ${this.state.totalCost}</h3>
                                           <h3>Total Remaining After Payment: ${this.state.totalCost - this.state.amountDue}</h3>
                                           {this.state.buttonHash?
                                                <div>
                                                    <p>Please Choose Form of Payment</p>
                                                    <p>Use paypal to secure your child's place immediatly.  There is a charge of 2.9% + $.30 that paypal charges for this convienence, bringing the amount due to ${this.state.paypalCost}.</p>
                                                    <form target="paypal" action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post">
                                                        <input type="hidden" name="cmd" value="_s-xclick" />
                                                        <input type="hidden" name="hosted_button_id" value={this.state.buttonHash} />
                                                        <table class="hidden">
                                                        <tBody>
                                                        <tr><td><input type="hidden" name="on0" value="Price" /></td></tr><tr><td><select name="os0">
                                                            <option value={this.state.paypalCost}>{this.state.paypalCost}</option>
                                                        </select> </td></tr>
                                                        </tBody>
                                                        </table>
                                                        <input type="hidden" name="currency_code" value="USD" />
                                                        <input type="image" src="https://www.sandbox.paypal.com/en_US/i/btn/btn_paynowCC_LG.gif" onClick = {this.handleSubmit} border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                                                        <img alt="" border="0" src="https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                                                    </form>
                                                        <p className='field'>
                                                            Or send us a check for ${this.state.amountDue}.  Available spots will be filled as checks are recieved. For information on where to send the check click 
                                                            <Link style={{textDecoration: "underline"}}  to={{pathname:"/mail", state: this.state}}>here</Link>.
                                                        </p>
                                                        <button className="button" id="previousPage4">Previous</button>
                                                </div>
                                           :<button className="button" id="previousPage4" onClick={this.handleNext}>Previous</button>
                                           }
                                       </div>
                                    }                                    
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
                
            )       
    }
}

export default Application