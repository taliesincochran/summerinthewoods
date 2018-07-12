import React from 'react'
import Helmet from 'react-helmet'
// import Moment from 'react-moment'
import { db } from '../firebase'
import BannerLanding from '../components/BannerLanding/'
import Checkbox from '../components/Checkbox'
import Selectable from '../components/Selectable'
import YearSelect from '../components/YearSelect'
import PaypalButton from '../components/PayPalButton'
class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.location.state.date,
            month: this.props.location.state.month,
            year: this.props.location.state.year,
            yearsArray: this.props.location.state.yearsArray,
            chosenYear: this.props.location.state.year,
            numberOfChildren: 1,
            totalCost: 0,
            amountDue: 0,
            savings: 0,
            // localTimezoneOffset: props.loction.state.localTimezoneOffset,
            campTimezoneOffset: 4,
            localTimezoneOffset: this.props.location.state.localTimezoneOffset,
            campTimes: this.props.location.state.campTimes,
            rawCampTimes: this.props.location.state.rawCampTimes,
            Week1: 0,
            Week2: 0,
            Week3: 0,
            Week4: 0,
            Week5: 0,
            Week6: 0,
            Week7: 0,
            Week8: 0,
            weekArray: [],
            hash: '',
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
            address:''


        }
        this.handleChange = this.handleChange.bind(this)
        this.handleYearSelect = this.handleYearSelect.bind(this)
        this.handleWeekSelect = this.handleWeekSelect.bind(this)
        this.getWeeks =  this.getWeeks.bind(this)
    }
    componentDidMount() {
        let _props = this.props.location.state
        console.log("apply this.props", this.props, _props.rawCampTimes[_props.chosenYear])
        console.log("get weeks parameter", _props.rawCampTimes[_props.chosenYear])
        this.setState({weekArray: this.getWeeks(_props.rawCampTimes[_props.chosenYear],_props.chosenYear)})
        console.log('apply state', this.state)
    }
    getWeeks (yearChosen, yearString) {
        console.log("get weeks called", yearString)
        let weekArray = [];
        console.log("yearChosen", yearChosen);
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
        console.log("week array", weekArray)
        return weekArray
    }
    handleChange = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }
    handleYearSelect = year => {
        console.log('year select', year)
        
        this.setState({ chosenYear : year, weekArray: this.getWeeks(this.state.rawCampTimes[year], year)})
    }
    handleWeekSelect = (week, value) => {
        if(this.state[week] == value) {
            this.setState({[week]: 0}, ()=>this.getCost())
        } 
        else {
            this.setState({[ week ]: value},() => this.getCost());    
        }
        console.log("week select", 'week', week, 'value', value)
    }
    getCost = () => { 
        let weekArray = [this.state.Week1, this.state.Week2, this.state.Week3, this.state.Week4, this.state.Week5, this.state.Week6, this.state.Week7, this.state.Week8];
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
        if(fiveDayNumber>5) {
            fiveDayCost = 135 * fiveDayArray.length;
            initialCost = 135;
            savings = 40 * fiveDayArray.length;
        } else if(fiveDayNumber> 3) {
            fiveDayCost = 150 * fiveDayArray.length;
            initialCost = 150;
            savings = 25 * fiveDayArray.length;
        } else if(fiveDayNumber) {
            fiveDayCost = 175 * fiveDayArray.length;
            initialCost = 175;
        } else if (!fiveDayNumber && totalWeeksSelected) {
            initialCost = 120;
        }
        let totalCost = fiveDayCost + threeDayCost;
        let amountDue = initialCost + (totalWeeksSelected - 1) * 25; 
        this.setState({totalCost, amountDue, savings});
        this.setButton(this.state.amountDue)
    }

    setButton = (amountDue)=>{
        let hash = "";
        switch (amountDue){
            case amountDue == 120:
                hash= "";
                break;
            case amountDue == 135:
                hash= "";
                break;
            case amountDue == 145:
                hash= "";
                break;
            case amountDue == 150:
                hash= "";
                break;
            case amountDue == 160:
                hash= "";
                break;
            case amountDue == 170:
                hash= "";
                break;
            case amountDue == 175:
                hash= "";
                break;
            case amountDue == 185:
                hash= "";
                break;
            case amountDue == 195:
                hash= "";
                break;
            case amountDue == 200:
                hash= "";
                break;
            case amountDue == 210:
                hash= "";
                break;
            case amountDue == 220:
                hash= "";
                break;
            case amountDue == 225:
                hash= "";
                break;
            case amountDue == 235:
                hash= "";
                break;
            case amountDue == 245:
                hash= "";
                break;
            case amountDue == 250:
                hash= "";
                break;
            case amountDue == 260:
                hash= "";
                break;
            case amountDue == 270:
                hash= "";
                break;
            case amountDue == 275:
                hash= "";
                break;
            case amountDue == 285:
                hash= "";
                break;
            case amountDue == 300:
                hash= "";
                break;
            case amountDue == 325:
                hash= "";
                break;
        }
        this.setState({hash});
    }

    render() {
        console.log("apply props ", this.props)
        console.log("apply state ", this.state)
        let _props = this.props.location.state;
        return(
            this.props.location.state.isLoadingCalendar?
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
                :
                <div>
                    <Helmet>
                        <title>Summer In The Woods</title>
                        <meta name="description" content="Application Page" />
                    </Helmet>
                    <BannerLanding bannerClass="contactBanner" />
                    <div id="main">
                        <div className="inner">
                            <section>
                                <form method="post" action='#'>
                                    <p>To reserve your child’s spot, please submit this completed htmlForm and a deposit of your first week’s payment
                                        plus $25 per additional week. The waiver can be signed once you have visited our location.
                                    </p>
                                    <div>
                                        <p>Year</p>
                                        <div className="yearBox">
                                        <h2>Select the weeks you would your child to attend.</h2>
                                        {_props.yearsArray.length > 1?
                                            <div>
                                                <Checkbox
                                                    name="year1"
                                                    value={_props.yearsArray[0]}
                                                    onChange={this.handleYearSelect} 
                                                    checked={this.state.chosenYear == _props.yearsArray[0]}
                                                    className='float-left'
                                                    value={_props.yearsArray[0]}
                                                    onClick={() => this.handleYearSelect(_props.yearsArray[0])}
                                                    text={_props.yearsArray[0]}
                                                />
                                                <Checkbox 
                                                    type="checkbox" 
                                                    name="year2"
                                                    value={_props.yearsArray[1]}
                                                    onChange={this.handleYearSelect}
                                                    checked={this.state.chosenYear == _props.yearsArray[1]} 
                                                    className='float-left'
                                                    value={_props.yearsArray[0]}
                                                    onClick={() => this.handleYearSelect(_props.yearsArray[1])} 
                                                    text={_props.yearsArray[1]}
                                                />
                                            </div>
                                        :
                                            <div>
                                                <Checkbox
                                                    name="year1"
                                                    value={_props.yearsArray[0]}
                                                    onChange={this.handleYearSelect} 
                                                    checked={true}
                                                    className='float-left'
                                                    value={_props.yearsArray[0]}
                                                    onClick={() => this.handleYearSelect(_props.yearsArray[0])}
                                                    text={_props.yearsArray[0]}
                                                />
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
                                                        <Checkbox
                                                            name={`"${week.week}5"`}
                                                            value="5"
                                                            onChange={()=>this.handleWeekSelect(week.week, 5)}
                                                            checked={this.state[week.week] == "5"}
                                                            value='5'
                                                            onClick={()=> this.handleWeekSelect(week.week, 5)}
                                                            text="5 day"
                                                            
                                                        />
                                                        <Checkbox
                                                            name={`"${week.week}3"`}
                                                            value='5'
                                                            onChange={()=>this.handleWeekSelect(week.week, 5)}
                                                            checked={this.state[week.week] == "3"}
                                                            value='5'
                                                            onClick={()=> this.handleWeekSelect(week.week, 3)}
                                                            text="3 day"
                                                        />
                                                    </div>
                                                    :
                                                    <div key={i}>
                                                        <Checkbox
                                                            labelStyle={{textDecoration: 'line-through'}}
                                                            disabled={true}
                                                            name={`"${week.week}5"`}
                                                            value="5"
                                                            onChange={()=>this.handleWeekSelect(week.week, 5)}
                                                            checked={this.state[week.week] == "5"}
                                                            value='5'
                                                            onClick={()=> this.handleWeekSelect(week.week, 5)}
                                                            text="5 day"
                                                        />
                                                        <Checkbox
                                                            disabled={true}
                                                            labelStyle={{textDecoration: 'line-through'}}
                                                            name={`"${week.week}3"`}
                                                            value='5'
                                                            onChange={()=>this.handleWeekSelect(week.week, 5)}
                                                            checked={this.state[week.week] == "3"}
                                                            value='5'
                                                            onClick={()=> this.handleWeekSelect(week.week, 3)}
                                                            text="3 day"
                                                        />
                                                    </div>
                                                }
                                               
                                            </div>                                                
                                        )}
                                        </div>
                                    </div> 
                                    <div>
                                        <h2>Child's Information</h2>
                                        <div className="infoBox">                           
                                            <div className="field half first">
                                                <label htmlFor="childFirstName">Child's First Name</label>
                                                <input type="text" name="childFirstName" required onChange={this.onChange}></input>
                                            </div>
                                            <div className="field half">
                                                <label htmlFor="childLastName">Child's Last Name</label>
                                                <input type="text" name="childLastName" required onChange={this.onChange}></input>
                                            </div>
                                            <div className="field half first">
                                                <label htmlFor='age'>Age</label>
                                                <input type="number" name="age" required onChange={this.onChange}></input>
                                            </div>
                                            <div className="field half">
                                                <label htmlFor="birthday">Birthdate</label>
                                                <input type="date" name="birthday" required onChange={this.onChange}></input>
                                            </div>
                                            <div className="field">
                                                <label htmlFor="allergies">Allergies</label>
                                                <textarea name="allergies" rows="6" onChange={this.onChange}></textarea>
                                            </div>
                                        </div>
                                        <h2>Parent Information</h2>
                                        <div className="infoBox">
                                            <div className='smallBox'>
                                                <p  className="formText">Parent 1</p>  
                                                <div className="field half">
                                                    <label htmlFor="parent1Name">Parent or Guardian's Name</label>
                                                    <input type="text" name="parent1Name" required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="parent1Phone">Parent or Guardian's Phone Number</label>
                                                    <input type="tel" name="parent1Phone" required onChange={this.onChange}></input>
                                                </div>
                                            </div>
                                            <p  className="formText">Parent 2</p>
                                            <div className="smallBox">
                                                <div className="field half">
                                                    <label htmlFor="parent2Name">Parent or Guardian's Name</label>
                                                    <input type="text" name="parent2Name" onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="parent2Phone">Parent or Guardian's Phone Number</label>
                                                    <input type="tel" name="parent2Phone" onChange={this.onChange}></input>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label htmlFor="address">Address</label>
                                                <textarea name="address" rows="4"  required onChange={this.onChange}></textarea>
                                            </div>
                                        </div>
                                        <h2>Emergency Information</h2>
                                        <div className="infoBox">
                                            <div className="smallBox">
                                                <p className="infoText">List two other contacts who will assume temporary care of your child if you cannot be reached</p>
                                                <p className="formText">Contact 1</p>
                                                <div className="field half">
                                                    <label htmlFor="emergency1Name">Contact's Name</label>
                                                    <input type="text" name="emergency1Name" required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="emergency1Phone">Contact's Phone Number</label>
                                                    <input type="tel" name="emergency1Phone" required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="emergency1Relationship">Contact's Relationship</label>
                                                    <input type="text" name="emergency1Relationship" required onChange={this.onChange}></input>
                                                </div>
                                            </div>
                                            <p className="formText">Contact 2</p>
                                            <div className="smallBox">
                                                <div style={{height:'5px'}} />
                                                <div className="field half">
                                                    <label htmlFor="emergency2Name">Contact's Name</label>
                                                    <input type="text" name="emergency2Name"  required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="emergency2Phone">Contact's Phone Number</label>
                                                    <input type="tel" name="emergency2Phone"  required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="emergency2Relationship">Contact's Relationship</label>
                                                    <input type="text" name="emergency2Relationship" required onChange={this.onChange}></input>
                                                </div>
                                            </div>
                                            <div style={{marginBottom: "30px"}}>
                                                <div className="field half">
                                                    <label htmlFor="physicianName">Physician's Name</label>
                                                    <input type="text" name="physicianName"  required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="physicianPhone">Physician's Number</label>
                                                    <input type="tel" name="physicianPhone" required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="dentistName">Dentist's Name</label>
                                                    <input type="text" name="dentistName"  required onChange={this.onChange}></input>
                                                </div>
                                                <div className="field half">
                                                    <label htmlFor="dentistPhone">Dentists's Number</label>
                                                    <input type="tel" name="dentistPhone"  required onChange={this.onChange}></input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p>Amount Due: ${this.state.amountDue}{'    '}Total Cost: ${this.state.totalCost}</p>
                                </form>
                            </section>
                        </div>
                        <PaypalButton
                                                    //currency='USD'
                                                    //total={225}
                                                    //client={{name:'Betty'}}
                                                    />
                    </div>
                </div>            
        )        
    }
}

export default Application
