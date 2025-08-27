// load file words.json
fetch("words.json")
      .then(response => response.json())
      .then(words => {
        const datalist = document.getElementById("word-list");
        words.forEach(word => {
          const option = document.createElement("option");
          option.value = word;
          datalist.appendChild(option);
        });
})
.catch(err => console.error("Không load được word list:", err));

const push_lsl_ctn = document.getElementById('pushLessonListContainer');
const lesson_list_container = document.getElementById('lessonListContainer');
const push_practice_container = document.getElementById('pushPracticeContainer');
const practice_container = document.getElementById('practiceContainer');
const practice_menu = document.getElementById('practiceMenu');
const lesson_list_table = document.getElementById('lessonListTable');
const add_new_lesson_button = document.getElementById('inputNewLessonButton');
const new_lesson_title = document.getElementById('inputNewLessonTitle');
const word_sentence_table = document.getElementById('wordSentenceTable');
const add_new_word_sentence_button = document.getElementById('addNewWordSentenceButton');
const input_new_word_sentence = document.getElementById('inputNewWordSentence');
const record_button = document.getElementById('recordButton');
const text_from_voice = document.getElementById('textFromVoice');
const word_sentence_list = document.getElementById('wordSentenceList');
const input_grammer = document.getElementById('inputGrammer');
const input_level = document.getElementById('inputLevel');

const url_api = 'https://english-learning-api-gxwm.onrender.com';
// const url_api = 'http://localhost:3003';

let display_lesson_list_container = true;
let display_practice_container = true;
let user_id = 0;
let lesson_id = 0;
let lesson_no = 0;
let lesson_title ='';
let practice_type ='';
let text = '';
let level =0;
let submit_date='';
let old_lesson_list=[];
let new_lesson_list = [];
let all_lesson_list =[];
let new_lesson_object ={};
let new_word_sentence_object ={};
let new_word_sentence_list=[];
let old_word_sentence_list =[];
let all_word_sentence_list=[];
load_lesson_list_from_database();

push_lsl_ctn.addEventListener('click',function(){
    if(display_lesson_list_container) {
        lesson_list_container.classList.add('hidden');
        display_lesson_list_container=!display_lesson_list_container;
    }
    else{
        lesson_list_container.classList.remove('hidden');
        display_lesson_list_container=!display_lesson_list_container;
    }
})
push_practice_container.addEventListener('click',function(){
    if(display_practice_container){
        practice_container.classList.add('hidden');
        display_practice_container=!display_practice_container;
    }
    else{
        practice_container.classList.remove('hidden');
        display_practice_container=!display_practice_container;
    }
})
practice_menu.addEventListener('click', function(e) {
  if(e.target.tagName === 'LI') {
    // Xóa class active khỏi tất cả item
    practice_menu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    // Thêm active cho item được click
    e.target.classList.add('active');
    //lấy số thứ tự item được chọn để phục vụ cho việc phân lịa bài thực hành
    selectedIndex = Array.from(practice_menu.children).indexOf(e.target);
    console.log("Item được chọn:", selectedIndex);
  }
});

function render_lesson_list(data,table){
    while (table.rows.length>1) {table.deleteRow(1);}
    data.forEach((element,index)=>{
        let new_row = table.insertRow();
        let lesson_no_cell = new_row.insertCell(0);
        let lesson_title_cell = new_row.insertCell(1);
        let lesson_delete_cell = new_row.insertCell(2);

        lesson_no_cell.textContent = index+1;
        lesson_title_cell.textContent = element.lesson_title;

        //tạo nút delete
        let delete_button = document.createElement('button');
        delete_button.textContent = 'Delete';
        delete_button.classList.add('delbtn');
        lesson_delete_cell.appendChild(delete_button);
        delete_button.addEventListener("click", function () { 
            new_row.remove();
            delete_leson(element.lesson_id);
        })
        //Tạo sự kiện khi nhấn vào dòng chứa tên bài học
        new_row.addEventListener('click',function(event){
            // Tránh chọn khi click vào nút Delete
            if (event.target.tagName === 'BUTTON') return;
            user_id=element.user_id;
            lesson_id=element.lesson_id;
            lesson_no=element.lesson_no;
            lesson_title=element.lesson_title;
            practice_type=element.practice_type;
            text = element.text;
            level = element.level;
            submit_date = element.submit_date; 
            console.log('Lesson selected : ', index + 1);
            console.log('UserID : ',user_id);
            console.log('LessonID : ',lesson_id);
            console.log('LessonNo : ',lesson_no);
            console.log('Lesson Title : ',lesson_title);
            console.log('Practice Type : ',practice_type);
            console.log('Text : ',text);
            console.log('Level : ',level);
            console.log('Submit date : ',submit_date);
            table.querySelectorAll('tr').forEach(tr => tr.classList.remove('lesson-list-table-row-active'));
            this.classList.add('lesson-list-table-row-active');
            load_word_sentence_from_database(element.lesson_id);
            
        })
    })
}
//H
function render_word_sentence_list(data,table){
    while (table.rows.length>1) {table.deleteRow(1);}
    data.forEach((element,index)=>{
        let new_row = table.insertRow();
        let word_sentence_no_cell = new_row.insertCell(0);
        let word_sentence_title_cell = new_row.insertCell(1);
        let word_sentence_grammer_cell = new_row.insertCell(2);
        let word_sentence_level_cell = new_row.insertCell(3)
        let word_sentence_speak_cell = new_row.insertCell(4);
        let word_sentence_delete_cell = new_row.insertCell(5);

        word_sentence_no_cell.textContent = index+1;
        word_sentence_title_cell.textContent = element.word_sentence;
        word_sentence_grammer_cell.textContent = element.grammer;
        word_sentence_level_cell.textContent=element.level;
        //tạo nút speak
        let speak_button = document.createElement('button');
        speak_button.textContent = '🔊';
        speak_button.classList.add('speak_button');
        word_sentence_speak_cell.appendChild(speak_button);
        speak_button.addEventListener("click", function () { 
            speak(element.word_sentence);
        })

        //tạo nút delete
        let delete_button = document.createElement('button');
        delete_button.textContent = 'Delete';
        delete_button.classList.add('delbtn');
        word_sentence_delete_cell.appendChild(delete_button);
        delete_button.addEventListener("click", function () { 
            new_row.remove();
            delete_word_sentence(element.word_sentence_id,lesson_id);
        })
        //Tạo sự kiện khi nhấn vào dòng chứa tên bài học
        new_row.addEventListener('click',function(event){
            // Tránh chọn khi click vào nút Delete
            if (event.target.tagName === 'BUTTON') return;
            // user_id=element.user_id;
            // lesson_id=element.lesson_id;
            // lesson_no=element.lesson_no;
            // lesson_title=element.lesson_title;
            // practice_type=element.practice_type;
            // text = element.text;
            // level = element.level;
            // submit_date = element.submit_date; 
            // console.log('Lesson selected : ', index + 1);
            // console.log('UserID : ',user_id);
            // console.log('LessonID : ',lesson_id);
            // console.log('LessonNo : ',lesson_no);
            // console.log('Lesson Title : ',lesson_title);
            // console.log('Practice Type : ',practice_type);
            // console.log('Text : ',text);
            // console.log('Level : ',level);
            console.log('Từ cần kiểm tra : ',element.word_sentence);
            table.querySelectorAll('tr').forEach(tr => tr.classList.remove('lesson-list-table-row-active'));
            this.classList.add('lesson-list-table-row-active');
            new_word_sentence_list = [];
            
        })
    })
}
add_new_lesson_button.addEventListener('click',function(){
    if (String(new_lesson_title.value).length>0)
    {
        new_lesson_list = [];
        new_lesson_object.user_id=123;
        new_lesson_object.lesson_id=String(Date.now());
        lesson_no=lesson_no+1;
        new_lesson_object.lesson_no=lesson_no;
        new_lesson_object.lesson_title = new_lesson_title.value;
        new_lesson_title.value='';
        submit_date = new Date();
        new_lesson_object.submit_date = submit_date.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" }).replace(" ", "T")
        console.log("New lesson nè : ",new_lesson_object);
        new_lesson_list.push(Object.assign({},new_lesson_object));
        console.log("New lesson list nè : ",new_lesson_list);
        all_lesson_list=old_lesson_list.concat(new_lesson_list);
        console.log("All lesson list nè : ",all_lesson_list);
        save_lesson_list_to_database(new_lesson_list);  
    }
})
add_new_word_sentence_button.addEventListener('click',function(){
    if (String(input_new_word_sentence.value).length>0 && lesson_id!=0 && String(input_grammer.value).length>0 && String(input_level.value).length>0)
    {
        new_word_sentence_object.lesson_id=lesson_id;
        new_word_sentence_object.word_sentence_id =String(Date.now());
        new_word_sentence_object.word_sentence=String(input_new_word_sentence.value);
        new_word_sentence_object.grammer = String(input_grammer.value);
        new_word_sentence_object.level = String(input_level.value);
        submit_date = new Date();
        new_word_sentence_object.submit_date = submit_date.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" }).replace(" ", "T")
        console.log("New word sentence nè : ",new_word_sentence_object);
        new_word_sentence_list.push(Object.assign({},new_word_sentence_object));
        console.log("New word sentence list nè : ",new_word_sentence_list);
        all_word_sentence_list=old_word_sentence_list.concat(new_word_sentence_list);
        save_word_sentence_list_to_database(new_word_sentence_list);
        new_word_sentence_list=[];
        input_new_word_sentence.value='';
        
    }
    else if (lesson_id===0) {alert('Please select a lesson.');}
    else if (String(input_new_word_sentence.value).length===0){alert('Please input new word or sentence.');}
    else if (String(input_grammer.value).length===0){alert('Please input grammer.');}
    else if (String(input_level.value).length===0){alert('Please input level.');}
})
input_new_word_sentence.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      if (String(input_new_word_sentence.value).length>0)
        {
        new_word_sentence_object.lesson_id=lesson_id;
        new_word_sentence_object.word_sentence_id =String(Date.now());
        new_word_sentence_object.word_sentence=String(input_new_word_sentence.value);
        submit_date = new Date();
        new_word_sentence_object.submit_date = submit_date.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" }).replace(" ", "T")
        console.log("New word sentence nè : ",new_word_sentence_object);
        new_word_sentence_list.push(Object.assign({},new_word_sentence_object));
        console.log("New word sentence list nè : ",new_word_sentence_list);
        all_word_sentence_list=old_word_sentence_list.concat(new_word_sentence_list);
        save_word_sentence_list_to_database(new_word_sentence_list);
        new_word_sentence_list=[];
        input_new_word_sentence.value='';

        }
    }
  });
async function load_lesson_list_from_database(){
    let request_string = url_api+'/Invoice?yeucau=lessonlist';
    fetch(request_string, {
        method: 'GET',
        headers: {
            // 'Authorization': `Bearer ${token}`
            'Authorization': `Bearer`
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function (data) {
        // Ẩn spinner và hiển thị nội dung
        // loadingElement.style.display = 'none';
        // bang_invoice.style.display = 'table';
        // console.log(data); //dữ liệu trả về dưới dạng mảng của đối tượng, mỗi đối tượng là 1 invoice 
        render_lesson_list(data,lesson_list_table); 
        old_lesson_list=data;
        lesson_no = old_lesson_list.length;
        console.log("Gán data cho old lesson list nè : ",old_lesson_list);
    })
    .catch(function(error) {
        console.error('Error:', error.message); // In ra thông điệp lỗi
    });
}
async function save_lesson_list_to_database(json_data) {
  if (json_data.length > 0) {
    try {
      const response = await fetch(url_api+'/Invoice?yeucau=savelesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Lesson saved!');
      console.log('Server response:', data);
      load_lesson_list_from_database();

    } catch (error) {
      alert('Save failed! ' + error);
      console.error('Error details:', error);
    }
  }
}
async function save_word_sentence_list_to_database(json_data) {
  if (json_data.length > 0) {
    try {
      const response = await fetch(url_api+'/Invoice?yeucau=savewordsentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Saved!');
      console.log('Server response:', data);
      load_word_sentence_from_database(json_data[0].lesson_id);
      // auto scroll xuống cuối
      word_sentence_list.scrollTop = word_sentence_list.scrollHeight;

    } catch (error) {
      alert('Save failed! ' + error);
      console.error('Error details:', error);
    }
  }
}
async function delete_leson(lessonId) {
    try {
      const response = await fetch(url_api+'/Invoice?yeucau=deletelesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lesson_id: lessonId })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Lesson deleted!');
      console.log('Server response:', data);
      load_lesson_list_from_database();

    } catch (error) {
      alert('Delete failed! ' + error);
      console.error('Error details:', error);
    }
}
async function delete_word_sentence(wordSentenceId,lessonID) {
    try {
      const response = await fetch(url_api+'/Invoice?yeucau=deletewordsentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word_sentence_id: wordSentenceId })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Deleted!');
      console.log('Server response:', data);
      load_word_sentence_from_database(lessonID);

    } catch (error) {
      alert('Delete failed! ' + error);
      console.error('Error details:', error);
    }
}
async function load_word_sentence_from_database(lessonId){
  let request_string = url_api+'/Invoice?yeucau=wordsentencelist';
    fetch(request_string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lesson_id: lessonId })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function (data) {
        console.log("Word sentence list nè : ",data);
        old_word_sentence_list=data;
        render_word_sentence_list(data,word_sentence_table);
    })
    .catch(function(error) {
        console.error('Error:', error.message); // In ra thông điệp lỗi
    });
}
////////////////////////////////////voice recognize////////////////////////////////////
let mediaRecorder;//biến để lưu đối tượng mediarecorder dùng để ghi âm
let chunks = [];//mảng chứa các mẩu nhỏ của âm thanh trong suốt quá trình ghi âm
let stream; // giữ thông tin của mic đang sử dụng để có thể tắt mic sau khi dùng xong

record_button.onclick = async function () {
  if (!mediaRecorder || mediaRecorder.state === "inactive") { //nếu chưa đang ghi âm hoặc trạng thái của biến mediarecorder là không hoạt động thì sẽ bắt đầu ghi âm
    // xin quyền micro
    stream = await navigator.mediaDevices.getUserMedia({ audio: true }); //xin quyền truy cập micro
    mediaRecorder = new MediaRecorder(stream);//tạo 1 đối tượng ghi âm mới nếu được cấp quyền truy cập

    mediaRecorder.ondataavailable = function (e) { //nếu phát hiện có âm thanh (do quá trình ghi âm) phát sinh trong biến mediarecorder thì đưa nó vào mảng chunks
      chunks.push(e.data); //cần khai báo sự kiện này trước để sẵn sàng trước khi bật mic (mediaRecorder.start();) để không bỏ lỡ bất kì mẫu dữ liệu nào 
    };

    mediaRecorder.onstop = async function () {//hàm thực hiện khi có sự kiện việc ghi âm kết thúc (nhờ nhấn nút)
      const blob = new Blob(chunks, { type: "audio/webm" }); //gom các mẩu âm thanh trong mảng chunks lại thành 1 file tên là blob ddihnj dạng đuôi là webm
      chunks = []; //xóa mảng chunks để còn sử dụng cho lần ghi âm sau 

      const formData = new FormData();//tạo 1 form mới để chuẩn bị cho việc gởi dữ liệu âm thanh lên sever 
      formData.append("audio", blob, "speech.webm"); //thêm dữ liệu âm thanh (file blob) vào form và đặt tên  trường dữ liệu là audio, dữ liệu được thêm vào là blob

      try {
        const res = await fetch("https://voice-recognize.onrender.com/stt", {  //gởi dữ liệu lên api
          method: "POST",
          body: formData
        });
        const data = await res.json(); //chờ nhận lại dữ liệu trả về từ api
        text_from_voice.innerText = data.text || data.error || "(no speech)"; //lấy ra text từ dữ liệu trả về và hiển thị lên
        input_new_word_sentence.value=String(data.text).charAt(0).toUpperCase() + String(data.text).slice(1);
        console.log(data.text);
      } catch (err) {
        text_from_voice.innerText = "Error: " + err.message; // lỗi thì báo        
      } finally {
        // tắt mic sau khi xử lý xong
        if (stream) {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
          stream = null;
        }
      }
    };

    mediaRecorder.start();
    console.log("Đang nghe...");
    record_button.style.backgroundColor="#e70826ff";
  } else if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("Đang xử lý..");
    record_button.style.backgroundColor="#2df705";
  }
};
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // chọn tiếng Anh Mỹ
    utterance.rate = 0.9;     // đọc hơi chậm lại
    utterance.pitch = 1.2;    // giọng cao một xíu
    speechSynthesis.speak(utterance);
}