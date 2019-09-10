import React, {Fragment} from 'react';
import './App.css';
import { PieChart } from 'react-chartkick'
import 'chart.js'
import { summarizers } from 'istanbul-lib-report';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      addNew:{
        id:null,
        workitem:'',
        duedata:'',
        status:'',  
        noofresourcces:null,
        enableUpdate: false,
        status:''
      },
      resources:[{
        id:1,
        workitem:'Start Templating',
        duedata:'23-may-2019',
        noofresourcces:3,
        enableUpdate: false,
        status:'Overdue'
      },
      {
        id:2,
        workitem:'Draw code',
        duedata:'25-may-2018',
        noofresourcces:4,
        enableUpdate: false,
        status:'Progress'
      },
      {
        id:3,
        workitem:'New Task',
        duedata:'26-may-2019',
        noofresourcces:5,
        enableUpdate: false,
        status:'Done'
      },
    ],
    numberofworkitem: null,
    removeUpdate:true,
    searchString:'',
    enableUpdate: false,
    workitem: false,
   
    }
  }

  addNewRow(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var resource = {
      id: id,
      workitem: "",
      duedata: "",
      noofresourcces: 0,
      enableUpdate:true
    }
    this.state.resources.push(resource);
    this.setState({
      resources: this.state.resources, 
      enableUpdate:true
    });

  }



  handleRowDel(resource) {
    var index = this.state.resources.indexOf(resource);
    this.state.resources.splice(index, 1);
    this.setState({
      resources: this.state.resources, 
      numberofworkitem: this.state.resources.length !==0 ? this.state.resources[0].noofresourcces: null},
      () => {
        localStorage.clear()
        localStorage.setItem('resources', JSON.stringify(this.state.resources))
      }
      );
  };

  componentDidMount(){
    debugger
    const storageResource = JSON.parse(localStorage.getItem('resources'))
    this.setState({
      resources: storageResource ? storageResource : [...this.state.resources],
      numberofworkitem: this.state.resources.length !==0 ? this.state.resources[0].noofresourcces: null
    })
  }

  addItem(item){
    debugger
    
      var index = this.state.resources.indexOf(item);
      this.state.resources.splice(index, 1);
      this.state.resources.push(this.state.addNew);
      this.setState({
        resources: this.state.resources, 
        enableUpdate:false
      }, () => {
        
        localStorage.setItem('resources', JSON.stringify(this.state.resources))
      });
    
    
  }

   handledChange = (e) =>{
     debugger
    
      this.setState({
        addNew:{
          ...this.state.addNew,
          id: this.id.value,
          workitem: this.workitem.value,
          duedata:  this.duedata.value,
          status:this.status.value,
          noofresourcces: this.noofresourcces.value,
  
        }
      })
     
   
  }

  editData = (eid) => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.resources = stateCopy.resources.slice();
    stateCopy.resources[eid] = Object.assign({}, stateCopy.resources[eid]);
    stateCopy.resources[eid].enableUpdate = true;
    this.setState(stateCopy);
  }

  update = (item) =>{
    debugger
    if(this.state.addNew.workitem !== ''){
      this.setState({
        workitem:false
      })
    var index = this.state.resources.indexOf(item);
    this.state.resources.splice(index, 1);
    this.state.resources.push(this.state.addNew);
    this.setState({
      resources: this.state.resources, 
      enableUpdate:false
    }, () => {
      
      localStorage.setItem('resources', JSON.stringify(this.state.resources))
    });
  }else{
    this.setState({
      workitem:true
    })
  }
  }

  filter = (e) => {
    debugger
    this.setState({searchString: e.target.value});
  }

render(){
 var _resources = this.state.resources
 let searchString = this.state.searchString.trim().toLowerCase();
  if (searchString.length > 0) {
      _resources = this.state.resources.filter(function(i) {
      return i.workitem.toLowerCase().match( searchString );
    });
  }

  debugger;
  var Overdue = this.state.resources.filter(res => res.status == 'Overdue')
  var sumOverdue= Overdue.reduce((d, item) => parseInt(item.noofresourcces) + parseInt(d), 0)

  var Progress = this.state.resources.filter(res => res.status == 'Progress')
  var sumProgress= Progress.reduce((d, item) => parseInt(item.noofresourcces) + parseInt(d), 0)

  var Done = this.state.resources.filter(res => res.status == 'Done')
  var sumDone= Done.reduce((d, item) => parseInt(item.noofresourcces) + parseInt(d), 0)

  return (
    <div className="container">
      <div className="row">
      <div className="col m5"><PieChart data={[["Overdue", Overdue.length > 0 ? sumOverdue: 0], ["Progress", Progress.length > 0 ? sumProgress: 0], ["Done", Done.length > 0 ?  sumDone : 0]]} /></div>
      </div>
      <div className="row">
        <div className="col m6">
          <input className="" type="text" onChange={(e) => this.filter(e)} placeholder="Search" />
        </div>
        <div className="col m3"> <p></p>
        <span>Number of work item: {this.state.numberofworkitem}</span></div>
        <div className="col m3"><p></p>
          <button className="btn" onClick={this.addNewRow.bind(this)}>Add New Item</button>
        </div>
      </div>
     
      <div className="row">
        <div className="col m12">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Workitem</th>
                <th>Due Date</th>
                <th>No. Resources Neede</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className={this.state.enableUpdate ? 'activeLine': 'inActive'}>
              
              {
                _resources.map((res, index) => <tr  key={index+1}>
                  <td>{res.enableUpdate ?<input type="text" className="hide--border" id="id" ref={id => this.id = id} onChange={(e) => this.handledChange(e)} defaultValue={index+1} /> : index+1}</td>
                 
                  <td>
                    {res.enableUpdate ? <input type="text" id="workitem"  ref={workitem => this.workitem = workitem} onChange={(e) => this.handledChange(e)} defaultValue={res.workitem} />: res.workitem}
                    </td>
                  <td>
                   {res.enableUpdate ?
                    <input type="date" id="duedata"  ref={duedata => this.duedata = duedata} onChange={(e) => this.handledChange(e)} defaultValue={res.duedata} />
                    :res.duedata}
                  </td>

                  <td>
                  {res.enableUpdate ?
                    <input type="text" id="noofresourcces"  ref={noofresourcces => this.noofresourcces = noofresourcces} onChange={(e) => this.handledChange(e)} defaultValue={res.noofresourcces} />
                  :res.noofresourcces
                  }
                  </td>
                  <td>
                   {res.enableUpdate ?
                    <select className="browser-default" id="status"  ref={status => this.status = status} onChange={(e) => this.handledChange(e)} defaultValue={res.status}>
                      <option>Overdue</option>
                      <option>Done</option>
                      <option>Progress</option>
                    </select>
                    :res.status}
                  </td>
                  <td>
                    {res.enableUpdate ?
                    <>
                      <button onClick={this.update.bind(this, res)} className="btn btn-sm hideAdd">Update</button>
                      <button onClick={this.addItem.bind(this, res)} className="btn btn-sm">Add</button>
                    </>
                    :<Fragment><button onClick={this.editData.bind(this, index)} className="btn btn-sm">Edit</button>&nbsp;
                    <button className="btn btn-sm" onClick={this.handleRowDel.bind(this, res)}>Delete</button></Fragment>}
                  </td>
                </tr>)
              }
            </tbody>
          </table>
          <div className="row">
            {this.state.workitem && <p className="alert--block">workitem is required.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
 
}

export default App;
