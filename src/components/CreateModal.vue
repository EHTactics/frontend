<template>
      <!-- Modal container -->
    <div class="fixed inset-0 bg-sky-950 bg-opacity-5 items-center justify-center font-poppins z-20">
        <div class="bg-white p-8 md:max-w-lg max-w-sm mx-auto mt-48 border-4 border-sky-950 rounded-xl max-h-[26rem] overflow-y-auto">
            <button @click="handleClose" id="close-btn">
                <i class="bi bi-x-lg"></i>
                <span></span>
            </button>
            <!-- Modal header -->
            <div class="mb-4 flex flex-col">
              <h2 class="text-2xl font-semibold text-center bg-sky-950 text-white mb-2" >Create {{ entityName == 'All' ? 'instructor': entityName }}</h2>
            </div>
            <!-- Modal body -->
            <div class="mb-4">
                <!-- Modal content header -->
                <div class="mb-4 flex flex-col">
                  <div class="grid gap-x-2 lg:grid-cols-1 sm-grid-cols-1 grid-cols-1">
                    <div ref="nameInputElement">
                      <label class="flex text-gray-700 text-sm font-bold mb-2" for="fullname">Full Name</label>
                      <input v-model="name" class="border rounded w-full py-2 px-3 md:h-10" id="fullname" type="text" placeholder="Enter Full name">
                      <p v-if="errors.name">{{ errors.name }}</p>
                    </div>
                    <div class="grid gap-x-2 lg:grid-cols-2 sm-grid-cols-2 grid-cols-2 pt-2">
                      <div>
                        <label class="flex text-gray-700 text-sm font-bold pb-1" for="shift">Shift</label>
                        <select v-model="shift" class="cursor-pointer border rounded text-gray-700 w-full py-2 px-3 h-10" id="shift">
                          <option value=0>Part Time</option>
                          <option value=1>Full Time</option>
                        </select>
                      </div>
                      <div>
                        <label class="flex text-gray-700 text-sm font-bold pb-1" for="personal-type">Personal Type</label>
                        <select v-model="personelType" @change="handleChange" class="cursor-pointer border rounded text-gray-700 w-full py-2 px-3 h-10" id="personal-type">
                          <option v-for="entity in entities" :value="entity.id">{{ entity.entity_name }}</option>
                        </select>
                      </div>                    
                    </div>
                  </div>            
                </div>  
                <!-- End modal content header -->           
                <!-- Modal content body -->
                <div class="mb-4 flex flex-col">
                  <div v-if="personelType == 1" class="grid md:gap-x-2 md:lg:grid-cols-3 md:sm-grid-cols-3 gap-x-2 gap-y-2 grid-cols-3 sm-grid-cols-3">                  
                    <div >
                      <label class="flex text-gray-700 text-sm font-bold pb-1" for="subject">Subject</label>
                        <select v-model="subject" class="cursor-pointer border rounded text-gray-700 w-full py-2 px-3 pr-2" id="subject">
                          <option v-for="subject in subjects" :value="subject.id">{{ subject.name }}</option>
                      </select>   
                    </div>
                    <div >
                      <label class="flex text-gray-700 text-sm font-bold w-40 pb-1" for="section-year">Section & Year</label>
                      <select v-model="sectionYear" class="cursor-pointer border rounded text-gray-700 w-full py-2 px-3" id="section-year">
                          <option v-for="sectionYear in sectionYears" :value="sectionYear.id">{{ sectionYear.year_section }}</option>
                      </select>
                    </div>
                    <div >
                      <label class="block text-gray-700 text-sm font-bold pb-1" for="department">Department</label>
                      <select v-model="department" class="cursor-pointer border rounded text-gray-700 w-full py-2 px-3" id="department">
                        <option v-for="department in departments" :value="department.id">{{ department.name.toUpperCase() }}</option>
                      </select>
                    </div>         
                  </div>
                  <div v-if="personelType == 1" class="pt-2 grid md:gap-x-2 md:lg:grid-cols-2 md:sm-grid-cols-2 gap-x-2 gap-y-2 grid-cols-2 sm-grid-cols-2">
                    <div>
                      <label class="flex text-gray-700 text-sm font-bold pb-1" for="time">Time</label>
                      <input v-model="time" class="border rounded w-full h-9 px-3" id="time" type="text" placeholder="Eg. 1:00-2:30 PM">
                      <p v-if="timeError">{{ timeError }}</p>
                    </div>
                    <div>
                      <label class="flex text-gray-700 text-sm font-bold pb-1" for="day">Day</label>
                      <input v-model="day" class="border rounded w-full h-9 px-3" id="day" type="text" placeholder="Eg. MWF, TTH, SAT">
                      <p v-if="sYError">{{ sYError }}</p>
                    </div> 
                  </div>    
                  <div class="md:pl-[329px] pl-[200px] mt-2" v-if="personelType == 1">
                    <button @click="addClassBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl">Add Class</button>
                  </div>
                </div>
                <!-- End modal content body -->
                <!-- Modal content footer -->
                <div class="mb-4">
                  <p v-if="dataExist">{{ dataExist }}</p>
                  <div v-if="showTable " class="shadow-md sm:rounded-lg mt-4 overflow-auto md:max-h-[111px] max-h-[200px] border-2 border-sky-950">
                    <table class="max-w-screen w-full">
                      <thead class="border-2 border-sky-950 text-center bg-sky-950 text-white">
                        <th>Subject</th>
                        <th>Sections</th>
                        <th>Schedule</th>
                        <th>Time</th>
                        <th>Action</th>
                      </thead>
                      <tbody v-for="(klass,klassIndex) in classes" :key="klassIndex" class="md:text-center">
                        <tr v-for="(sched,schedIndex) in klass.schedules"
                          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-200 even:dark:bg-gray-800 dark:border-gray-700
                          border-b border-gray-200 hover:bg-gray-100">
                          <td v-if="schedIndex == 0" :rowspan="klass.schedules.length">{{ klass.subject.name }}</td>
                          <td>{{ sched.sectionYear.year_section }}</td>
                          <td>{{ sched.day }}</td>
                          <td>{{ sched.time }}</td>
                          <td>
                            <button @click="editData(klass.subject.id,sched.sectionYear.id,sched.day,sched.time,klassIndex,schedIndex)">Edit</button>
                            <button @click="removeRowData(klassIndex,schedIndex)">Remove</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>                  
                  <p v-if="errors.class && personelType == 1">{{ errors.class }}</p>
                </div>
                <!-- End modal content footer -->
            </div>
            <!-- Modal footer -->
            <div class="flex justify-end">
                <button @click="handleSaveButton" class="bg-sky-950 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import { useEvaluateeStore } from '../stores/evaluatee';


const evaluateeStore = useEvaluateeStore();
const nameInputElement =ref(null)
const status = ref()
const message = ref('');
const timeError = ref('');
const sYError = ref('');
const dataExist = ref('');
const errors = ref({});
const entities = ref(props.entities)
const name = ref('');
const shift = ref(0);
const department = ref(1);
const personelType = ref(props.entityId);
const subject = ref(1);
const sectionYear = ref(1);
const time = ref('');
const day = ref('');
const showTable = ref(false);
const classes = ref([]);
const entityName = ref(props.entity)


const props = defineProps([
    'showCreateModal',
    'entities',
    'entity',
    'entityId',
    'departments',
    'subjects',
    'sectionYears'
]);
const emits = defineEmits(['handleCloseButton','handleCreateClick']);

const handleChange = ()=>{
  if(personelType.value !== 1){
    showTable.value = false
  }else{
    showTable.value = true
  }

  entityName.value = entities.value.find(entity => entity.id == personelType.value).entity_name
}

const handleClick = (val)=>{
  alert(val)
  console.log(val)
}

const handleClose = () => {
  //  shift.value = ref(0)
  // department.value = ref(props.departments[0].id);
  // personelType.value = ref(props.entities[0].id)
  emits('handleCloseButton');
}

const editData = (subjectId,sectionYearId,scheduleData,timeData,parentIndex,childIndex) => {
  subject.value = subjectId
  sectionYear.value = sectionYearId
  day.value= scheduleData
  time.value = timeData
  removeRowData(parentIndex,childIndex)
}

const removeRowData = (parentIndex,childIndex) => {
  console.log(parentIndex,childIndex)
  classes.value[parentIndex].schedules.splice(childIndex,1)
  
}

const addClassBtn = ()=>{
  errors.value.class = ''
  let error = false
  if(time.value == ''){
    error = true
    timeError.value = 'Please enter a time'
  }else{
    timeError.value = ''
  }
  if(day.value == ''){
    error = true
    sYError.value = 'Please input the day'
  }else{
    sYError.value = ''
  }
  if(!error){
    sYError.value= ''
    timeError.value =''
    const findSY = props.sectionYears.find(sy => sy.id == sectionYear.value)
    const index = classes.value.findIndex(klass => klass.subject.id == subject.value )
    if(index != -1){// check if existing ang data
        if(!classes.value[index].schedules.some(sched => sched.sectionYear.id == sectionYear.value)){
          classes.value[index].schedules.push({
                              sectionYear: findSY,
                              day: day.value,
                              time: time.value
                            })
                            dataExist.value = ''
        }else{
          dataExist.value = 'The data already exists'
        }
    }else{
      const findSub =  props.subjects.find(sub => sub.id == subject.value)
      classes.value.push({
                        subject: findSub,
                        schedules: [
                          {
                            sectionYear: findSY,
                            day: day.value,
                            time: time.value
                          }
                        ]
                      })
    }
    showTable.value = true
    console.log( classes.value)
  }
}


// const capitalizeFirstLetter = (str) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// };



const handleSaveButton = async()=>{
    console.log(classes.value.length)
    console.log(classes.value)
    const val ={}
    if(name.value == ''){
      errors.value.name = 'name is required'
      console.log(nameInputElement.value)
      nameInputElement.value.scrollIntoView({ behavior: 'smooth' });
      return
    }

    if(personelType.value == 1 && classes.value.length != 0){
        val.classes = classes.value
    }else{
        errors.value.class = 'Please Add a Class'
        return 
    }

    val.name = name.value,
    val.entity_id = personelType.value,
    val.job_type =  shift.value,
    val.department_id =  department.value
    
    try{
      
      const res = await evaluateeStore.saveEvaluatee(val);
      console.log(res);

    }catch(e){
      console.log(e);
      status.value = e.response.status
      message.value = e.response.data.message
    }

  // name.value = ''
  // errors.value.class = ''personelType.value != 1
  // errors.value= {}
  //     name.value = ''
  //     department.value = props.departments[0].id;
  //     personelType.value = props.entities[0].id;
  //     subject.value = props.subjects[0].id;
  //     sectionYear.value = props.sectionYears[0].id;
  //     classes.value = {}
  //     showTable.value = false

}

</script>
<style scoped>
#close-btn {
  border: none;
  display: block;
  position: relative;
  padding: 4px 8px;
  font-size: 12px;
  background: transparent;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  color: black;
  z-index: 1;
  font-family: inherit;
  font-weight: 1500;
  margin-bottom: 10px;
  left: 97%;
  bottom: 20px;
}

#close-btn span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 2px solid rgb(109, 109, 109);
}

#close-btn span::before {
  content: "";
  display: block;
  position: absolute;
  width: 8%;
  height: 500%;
  background: var(--lightgray);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-60deg);
  transition: all 0.3s;
}

#close-btn:hover span::before {
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 100%;
  background-color: rgba(7, 89, 133, 1);
}

#close-btn:hover {
  color: white;
}

#close-btn:active span::before {
  background: #2751cd;
}
.overflow-y-auto::-webkit-scrollbar {
  display: none;
  width: 0px;
}
.overflow-y-auto:hover::-webkit-scrollbar {
  display: block;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background-color: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgb(8, 47, 73, 1);
  border-radius: 8px;
  width: 4px;
}
.overflow-auto::-webkit-scrollbar {
  display: none;
  width: 0px;
}
.overflow-auto:hover::-webkit-scrollbar {
  display: block;
}
.overflow-auto::-webkit-scrollbar-track {
  background-color: transparent;
}
.overflow-auto::-webkit-scrollbar-thumb {
  background-color: rgb(8, 47, 73, 1);
  border-radius: 8px;
  width: 4px;
}
</style>

