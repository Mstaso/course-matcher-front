import React from 'react'
import Course from '../components/Course'
import {Route, Switch} from 'react-router-dom'
import { connect } from 'react-redux'
import { getCourses } from '../redux/actions'
import { setCourses } from '../redux/actions'
import { setCategory } from '../redux/actions'
import { singleCourse } from '../redux/actions'
import FilterSetting from '../components/FilterSetting'
import ReactPaginate from 'react-paginate'

class CourseContainer extends React.Component {

    
    state = {
        offset: 0,
        coursesOnDisplay: [],
        perPage: 10,
        currentPage: 0,
        subcategory: "all"
    }

    componentDidMount(){
        document.body.scrollTop = 0;
        this.receivedCourses() 
        this.props.setCategory("all")
    }

    receivedCourses() {
        if (this.props.courses.length >= 10){
            this.props.category.length > 1 ? this.filterMainCategory(this.props.category) : this.displayCourses(this.props.courses)
        } else {
            fetch("https://course-matcher-back.herokuapp.com/api/v1/courses")
            .then(resp => resp.json())
            .then(data => { 
                this.props.setCourses(data)
                this.displayCourses(data)
            })
        }
         
    }
    displayCourses(data) {
            let slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
            let postData = slice.map(course =>             
                <Course course={course} key={course.id}/>)
                    
                    this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    coursesOnDisplay: postData,
                })
        
    }

    handleSearch = (searchValue) => {
        let coursesThroughSearch = this.props.courses.filter(course => 
            course.name.toLowerCase().includes(searchValue.toLowerCase()))
                this.displayCourses(coursesThroughSearch)
    }
    

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.setCoursesAfterClick()
        });

    };

    setCoursesAfterClick = () => {
        if (this.props.category === "all"){
            console.log(this.props.category)
            this.displayCourses(this.props.courses)
        } else {
            console.log("in else", this.state.subcategory)
            if (this.state.subcategory !== "all"){
                let data = this.props.courses.filter(course => course.subcategory === this.state.subcategory)
                console.log(data, this.state.subcategory)
                this.displayCourses(data)
            } else {
                let data = this.props.courses.filter(course => course.category === this.props.category)
                console.log(this.props.category)
                this.displayCourses(data)
            }
        }
    }

    filterMainCategory = (newcategory) => {
        if(newcategory !== this.props.category){
            this.props.setCategory(newcategory) 
        }
        let data = []
        newcategory === "all" ? data = this.props.courses : data = this.props.courses.filter(course => course.category === newcategory)
        this.displayCourses(data)        
    }

    returnSubcategories = (newSubcategory) => {
        this.setState({subcategory: newSubcategory})
        let data = []
        newSubcategory === "all" ? this.props.category === "all" ? data = this.props.courses : data = this.props.courses.filter(course => course.category === this.props.category)
        :
        data = this.props.courses.filter(course => course.subcategory === newSubcategory)
        this.displayCourses(data)
    }

    // displays similar courses to the one currently selected
    otherCourses = (foundCourse) => {
        let similarCourses = this.props.courses.filter(course => course.id !== foundCourse.id && course.category === foundCourse.category)
        let mappedOtherCourses = similarCourses.splice(0,4).map(course => <Course key={course.id} otherCourse={course}/>)
        return mappedOtherCourses
    }
    
    render(){
        return (
            <>
            
            <>
            <Switch>
                <Route path='/courses/:id' render={({ match }) => {
                    let id = parseInt(match.params.id)
                    if(this.props.courses.length > 0){
                    let foundCourse = this.props.courses.find((course) => course.id === id)
                    // console.log(foundCourse)
                    return (
              
                            // <div>
                            //     <div class="other-elements">
                            //         <h4>Other Users</h4>
                            // {mappedOtherUsers}   
                            //     </div>     
                            // <User userCourseCompleter={this.userCourseCompleter} foundUser={foundUser} />
                            // </div>
    
                
                        <div>
                            <div class="other-elements">
                                <h4>Similar Courses</h4>
                                {/* <hr></hr> */}
                            {this.otherCourses(foundCourse)}
                            </div>
                      
                            <Course foundCourse={foundCourse} />  
                         
                        </div>

                    )
                    } else {
                        fetch(`https://course-matcher-back.herokuapp.com/api/v1/courses${id}`)
                        .then(resp => resp.json())
                        .then(data => { 
                            return <Course foundCourse={data}/>
                         })
                    }
                }}/>
                <Route path="/courses" render={() => {

                    return (
                        <div>  
                        <FilterSetting handleSearch={this.handleSearch} filterMainCategory={this.filterMainCategory} returnSubcategories={this.returnSubcategories} category={this.props.category} />
                            {
                                this.props.courses.length === 0 ? <div class="courses-index"><h1>Loading Courses</h1></div> :
                                <div>
                                {this.state.coursesOnDisplay}
                                </div>
                            }
                <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
                        
                        </div>
                    )
                }} />
                <Route path="/home" render={() => {

                    return (
                        <>
                            {
                                this.state.coursesOnDisplay.length !== 10 ? <h1>Loading</h1> :
                                <div>
                                {this.state.coursesOnDisplay}
                                </div>
                            }
                        
                        
                        </>
                    )
                }} />

            </Switch>       
            </>
            
            
            
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        courses: state.courses,
        loggedInUser: state.loggedInUser,
        searchValue: state.searchValue,
        category: state.category
    }
    }

  const mapDispatchToProps = (dispatch) => {
    return { fetchCourses: ()=> dispatch(getCourses()),
             setCourses: (data)=>dispatch(setCourses(data)),
             setCategory: (category) => dispatch(setCategory(category)),
             fetchOneCourse: (id)=> dispatch(singleCourse(id))
            }
  } 

  
  
  export default connect(mapStateToProps, mapDispatchToProps)(CourseContainer);