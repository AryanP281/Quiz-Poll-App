(this.webpackJsonpquiz_poll_app=this.webpackJsonpquiz_poll_app||[]).push([[0],{26:function(e,t,n){},33:function(e,t,n){"use strict";n.r(t);var c=n(1),s=n.n(c),i=n(13),o=n.n(i),r=(n(26),n(9)),l=n(3),a=n(5),u=/[\w]+['@'][a-zA-z]{2,}['.'][a-z]{2,3}/g;function d(){if(0===document.cookie.length)return new Map;var e=document.cookie.split(";"),t=new Map,n=[];return e.forEach((function(e){n=e.split("="),t.set(n[0].trim(),n[1].trim())})),t}var h="https://quiz-poll-app.herokuapp.com",j=n(0),b="".concat(h,"/auth/signin"),p=["Invalid email","Invalid password","User not found","Incorrect Password","Failed to login. Try again"];function f(e){for(var t=[],n=0;n<p.length;++n)e&1<<n&&t.push(Object(j.jsx)("h5",{className:"error-message",children:p[n]},n));return t}var m=function(){var e=Object(c.useState)(0),t=Object(a.a)(e,2),n=t[0],s=t[1],i=Object(l.f)();return d().has("auth")?(i.replace("/"),null):(console.log("signin"),Object(j.jsx)("div",{className:"auth-page",children:Object(j.jsxs)("div",{className:"auth-box",children:[Object(j.jsxs)("div",{className:"auth-creds-sec",children:[Object(j.jsx)("h1",{children:"Quiz And Poll App"}),Object(j.jsx)("h3",{children:"Welcome back ! Sign in to continue"}),Object(j.jsxs)("form",{onSubmit:function(e){e.preventDefault(),function(e,t){var n={email:document.getElementById("email").value.trim(),pss:document.getElementById("pss").value.trim()},c=function(e){var t=0;return t|=0===e.email.length||-1===e.email.search(u),t|=(e.pss.length<6)<<1}(n);if(0!==c)return void e(c);fetch(b,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({user:n})}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(n){if(n.success)t.replace("/");else switch(n.code){case 1:e(3);break;case 3:e(4);break;case 4:e(8);break;default:throw Error(n)}})).catch((function(t){console.log(t),e(16)}))}(s,i)},children:[Object(j.jsx)("input",{type:"text",id:"email",placeholder:"Enter email",className:1&n||4&n?"invalid-input":""}),Object(j.jsx)("input",{type:"password",id:"pss",placeholder:"Enter password",className:2&n||8&n?"invalid-input":""}),Object(j.jsx)("button",{type:"submit",children:"Sign In"})]}),Object(j.jsx)("div",{className:"error-messages",children:0!==n&&f(n)}),Object(j.jsxs)("h3",{children:["Don't have an account ? ",Object(j.jsx)(r.b,{to:"/signup",children:" Sign Up "})," "]})]}),Object(j.jsx)("div",{className:"auth-anim-sec"})]})}))},O="".concat(h,"/auth/signup"),x=["Invalid email","Password should be atleast 6 characters long","Email already registered","Failed to sign up. Try again"];function v(e){for(var t=[],n=0;n<x.length;++n)e&1<<n&&t.push(Object(j.jsx)("h5",{children:x[n]},n));return t}var g=function(){var e=Object(c.useState)(0),t=Object(a.a)(e,2),n=t[0],s=t[1],i=Object(l.f)();return d().has("auth")?(i.replace("/"),null):Object(j.jsx)("div",{className:"auth-page",children:Object(j.jsxs)("div",{className:"auth-box",children:[Object(j.jsxs)("div",{className:"auth-creds-sec",children:[Object(j.jsx)("h1",{children:"Quiz And Poll App"}),Object(j.jsx)("h3",{children:"Hey there ! Signup to start making you own quizes and polls"}),Object(j.jsxs)("form",{onSubmit:function(e){e.preventDefault(),function(e,t){var n={email:document.getElementById("email").value.trim(),pss:document.getElementById("pss").value.trim()},c=function(e){var t=0;return t|=0===e.email.length||-1===e.email.search(u),t|=(e.pss.length<6)<<1}(n);if(0!==c)return void e(c);fetch(O,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({user:n})}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(n){if(n.success)t.replace("/editprofile");else switch(n.code){case 1:e(3);break;case 2:e(4);break;default:throw Error(n)}})).catch((function(t){console.log(t),e(8)}))}(s,i)},children:[Object(j.jsx)("input",{type:"text",id:"email",placeholder:"Enter email",className:1&n||4&n?"invalid-input":""}),Object(j.jsx)("input",{type:"password",id:"pss",placeholder:"Enter password",className:2&n?"invalid-input":""}),Object(j.jsx)("button",{type:"submit",children:"Sign Up"})]}),Object(j.jsx)("div",{className:"error-messages",children:0!==n&&v(n)}),Object(j.jsxs)("h3",{children:["Already have an account ? ",Object(j.jsx)(r.b,{to:"/signin",children:" Sign In "})," "]})]}),Object(j.jsx)("div",{className:"auth-anim-sec",children:Object(j.jsx)("h1",{children:"INSERT ANIMATION"})})]})})},y=n(10),w=n(15),N=Object(w.b)({name:"UserDetails",initialState:{username:"",bdate:{day:1,month:0,year:2e3},followers:0,following:0,initialized:!1,profilePic:"https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",polls:[]},reducers:{setUserDetails:function(e,t){var n=t.payload;e.username=n.username,e.bdate={day:n.bdate.day,month:n.bdate.month,year:n.bdate.year},e.followers=n.followers,e.following=n.following,e.initialized=!0,n.profilePicUrl&&(e.profilePic=n.profilePicUrl)},setProfilePicture:function(e,t){e.profilePic=t.payload.profilePicUrl},setPolls:function(e,t){e.polls.splice(0,e.polls.length),t.payload.userPolls.forEach((function(t){return e.polls.push(t)}))}}});var E=N.actions,P=E.setUserDetails,S=(E.setProfilePicture,E.setPolls),I=N.reducer,C="".concat(h,"/users/profile"),k="".concat(h,"/users/editprofile");function T(e,t){for(var n=[],c=new Date(t,e+1,0).getDate(),s=1;s<=c;++s)n.push(Object(j.jsx)("option",{value:"".concat(s),children:"".concat(s)},s));return n}function z(e){fetch(C,{method:"GET",headers:{"Content-Type":"application/json"},credentials:"include"}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(t){if(!t.success)throw Error(t.code);e(P({username:t.user.username,bdate:{day:t.user.bday,month:t.user.bmonth,year:t.user.byear},followers:t.user.followers,following:t.user.following,profilePicUrl:t.user.picUrl}))})).catch((function(e){console.log(e),alert("Failed to load user details")}))}var D=function(){var e=Object(y.c)((function(e){return e.userDetails})),t=Object(y.b)(),n=Object(l.f)(),s=Object(c.useState)(T(e.bdate.month,e.bdate.year)),i=Object(a.a)(s,2),o=i[0],r=i[1],u=Object(c.useState)(!1),d=Object(a.a)(u,2),h=d[0],b=d[1],p=Object(c.useState)(e.profilePic),f=Object(a.a)(p,2),m=f[0],O=f[1];Object(c.useEffect)((function(){e.initialized||z(t)}),[]),Object(c.useEffect)((function(){return O(e.profilePic)}),[e.profilePic]);var x=function(){r(T(parseInt(document.getElementById("bmonth").value),parseInt(document.getElementById("byear").value)))};return console.log("userProfile"),Object(j.jsx)("div",{className:"user-profile",children:Object(j.jsxs)("div",{className:"profile-box",children:[Object(j.jsxs)("div",{className:"box-title-bar",style:{alignSelf:"stretch"},children:[Object(j.jsx)("button",{onClick:function(){return n.push("/")},children:"Home"}),Object(j.jsx)("h1",{style:{color:"grey"},children:"Edit Profile"}),Object(j.jsx)("div",{})]}),Object(j.jsx)("img",{className:"user-pic",src:m,alt:"pic"}),Object(j.jsx)("input",{type:"file",id:"profile_pic",accept:"image/jpeg",onChange:function(e){return function(e,t){t.target.files&&t.target.files[0]&&e(URL.createObjectURL(t.target.files[0]))}(O,e)}}),Object(j.jsxs)("form",{onSubmit:function(n){n.preventDefault(),e.initialized&&function(e,t,n){n(!0);var c={username:document.getElementById("username").value.trim(),bday:parseInt(document.getElementById("bday").value),bmonth:parseInt(document.getElementById("bmonth").value),byear:parseInt(document.getElementById("byear").value)},s=document.getElementById("profile_pic");console.log(s.files),s.files&&s.files[0]&&(c.profilePic=s.files[0]);if(console.log(c),function(e){return e.username.length>0}(c)){var i=new FormData;e.username!==c.username&&i.append("username",c.username),e.bdate.day!==c.bday&&i.append("bday",c.bday),e.bdate.month!==c.bmonth&&i.append("bmonth",c.bmonth),e.bdate.year!==c.byear&&i.append("byear",c.byear),c.profilePic&&i.append("profilePic",c.profilePic),fetch(k,{method:"PUT",credentials:"include",body:i}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(s){if(!s.success)throw Error(s);var i={username:c.username?c.username:e.username,bdate:{day:c.bday?c.bday:e.bdate.day,month:c.bmonth?c.bmonth:e.bdate.month,year:c.byear?c.byear:e.bdate.year},followers:e.followers,following:e.following};t(P(i)),n(!1)})).catch((function(e){console.log(e),alert(e),n(!1)}))}else alert("Username cannot be empty")}(e,t,b)},children:[Object(j.jsx)("label",{for:"username",children:"Username"}),Object(j.jsx)("input",{type:"text",id:"username",defaultValue:e.username}),Object(j.jsx)("label",{children:"Birthday"}),Object(j.jsxs)("div",{children:[Object(j.jsx)("select",{id:"bday",defaultValue:e.bdate.day,children:o},e.bdate.day),Object(j.jsx)("select",{id:"bmonth",defaultValue:e.bdate.month,onChange:x,children:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"].map((function(e,t){return Object(j.jsx)("option",{value:"".concat(t),children:e},t)}))},e.bdate.month),Object(j.jsx)("select",{id:"byear",defaultValue:e.bdate.year,onChange:x,children:function(){for(var e=[],t=(new Date).getFullYear(),n=1950;n<=t;++n)e.push(Object(j.jsx)("option",{value:"".concat(n),children:n},n));return e}()},e.bdate.year)]}),Object(j.jsx)("button",{type:"submit",children:"Save Details"})]}),h&&Object(j.jsx)("div",{className:"loading-spinner"})]})})},B="".concat(h,"/content/userpolls"),U="".concat(h,"/auth/signout");function A(e){var t=e.history;return Object(j.jsxs)("div",{className:"side-nav-bar",children:[Object(j.jsx)("button",{onClick:function(){return t.push("/newpoll")},children:"Create New Poll"}),Object(j.jsx)("button",{onClick:function(){return t.push("/editprofile")},children:"Edit Profile"}),Object(j.jsx)("button",{onClick:function(){return function(e){fetch(U,{method:"GET",credentials:"include"}).then((function(t){if(200!==t.status)throw Error(t);e.replace("/signin")})).catch((function(e){console.log(e),alert("Failed to sign out. Try again")}))}(t)},children:"Log out"})]})}function F(e){var t=e.userDetails,n=e.history;return Object(j.jsxs)("div",{className:"top-bar",children:[Object(j.jsx)("div",{style:{flexBasis:"70%",flexGrow:"2"}}),t.initialized&&Object(j.jsxs)("div",{className:"profile-details",children:[Object(j.jsx)("h3",{children:t.username}),Object(j.jsx)("img",{className:"user-pic",src:t.profilePic,onClick:function(){return n.push("/editprofile")}})]})]})}function _(e){return Object(j.jsxs)("div",{className:"content-list",children:[Object(j.jsx)("div",{className:"content-list-title",children:Object(j.jsx)("h3",{children:e.title})}),Object(j.jsx)("div",{className:"content-list-content",children:e.children})]})}function J(e){return Object(j.jsxs)("div",{className:"user-polls-table",children:[Object(j.jsxs)("div",{className:"user-polls-headers",children:[Object(j.jsx)("h2",{style:{borderRight:"2px solid white"},children:"Poll Tile"}),Object(j.jsx)("h2",{children:"Vote Counts"})]}),Object(j.jsx)("div",{className:"user-polls-grid",children:function(){var t=[];return e.userPolls.forEach((function(n){t.push(Object(j.jsx)("button",{onClick:function(){return e.history.push("/poll/".concat(n.id))},children:n.name})),t.push(Object(j.jsx)("h3",{children:"".concat(n.votes," votes")}))})),t}()})]})}var G=function(){var e=Object(y.c)((function(e){return e.userDetails})),t=Object(y.b)(),n=Object(l.f)(),s=d();return s.has("auth")||n.replace("/signin"),Object(c.useEffect)((function(){s.has("auth")&&(e.initialized||z(t),function(e){fetch(B,{method:"GET",credentials:"include"}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(t){t.success&&e(S({userPolls:t.polls}))})).catch((function(e){console.log(e)}))}(t))}),[]),console.log("Home"),Object(j.jsxs)("div",{className:"home",children:[Object(j.jsx)(A,{history:n}),Object(j.jsxs)("div",{className:"dashboard",children:[Object(j.jsx)(F,{userDetails:e,history:n}),Object(j.jsx)("div",{className:"user-polls-list",children:Object(j.jsx)(_,{title:"".concat(e.username,"'s Polls"),children:e.polls&&Object(j.jsx)(J,{userPolls:e.polls,history:n})})})]})]})},M=n(20),V=0,q="".concat(h,"/content/createpoll"),H=["Poll title cannot be empty","Poll should have atleast one non-empty option","Failed to create new poll"],L=!1;function R(e){var t=e.option;return Object(j.jsxs)("div",{className:"new-poll-option",children:[Object(j.jsx)("input",{type:"text",onChange:function(e){return t.txt=e.target.value},placeholder:t.txt.length?t.txt:"Enter new option",style:{flexBasis:"90%",flexGrow:"2"}}),Object(j.jsx)("button",{onClick:function(){return function(e,t,n){var c=[];t.forEach((function(t){t.id!==e.id&&c.push(t)})),n(c)}(t,e.options,e.setOptions)},children:Object(j.jsx)(M.b,{size:40})})]})}function Q(e){for(var t=[],n=0;n<H.length;++n)e&1<<n&&t.push(Object(j.jsx)("h5",{className:"error-message",children:H[n]},n));return t}var W,Y=function(){var e=Object(c.useState)([]),t=Object(a.a)(e,2),n=t[0],s=t[1],i=Object(c.useState)([0,!1]),o=Object(a.a)(i,2),r=o[0],u=o[1],d=Object(l.f)();return console.log("New Poll"),Object(j.jsx)("div",{className:"new-poll",children:Object(j.jsxs)("div",{className:"new-poll-box",children:[Object(j.jsxs)("div",{className:"box-title-bar",children:[Object(j.jsx)("button",{onClick:function(){return d.push("/")},children:"Home"}),Object(j.jsx)("h1",{children:"New Poll"}),Object(j.jsx)("div",{})]}),Object(j.jsxs)("form",{onSubmit:function(e){e.preventDefault()},children:[Object(j.jsx)("input",{type:"text",id:"poll_title",placeholder:"Enter Question",className:1&r[0]?"invalid-input":""}),Object(j.jsx)("div",{children:n.map((function(e){return Object(j.jsx)(R,{option:e,options:n,setOptions:s},e.id)}))}),Object(j.jsx)("div",{id:"new-option-btn-container",children:Object(j.jsxs)("button",{id:"new-option-btn",onClick:function(){return function(e,t){var n=[];e.forEach((function(e){n.push({id:e.id,txt:e.txt})})),n.push({id:V,txt:""}),V++,t(n)}(n,s)},children:[" ",Object(j.jsx)(M.a,{size:40})," "]})}),Object(j.jsx)("button",{type:"submit",onClick:function(){console.log(L),L||(L=!0,function(e,t,n){var c={name:document.getElementById("poll_title").value.trim(),options:function(){var t,n=[];return e.forEach((function(e){0!==(t=e.txt.trim()).length&&n.push(t)})),n}()};console.log(c);var s=function(e){var t=0;return t|=0===e.name.length,t|=(0===e.options.length)<<1}(c);0===s?(t([0,!0]),fetch(q,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({poll:c})}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(e){return e.success?void n.replace("/poll/".concat(e.pollId)):void t([3,!1])})).catch((function(e){console.log(e),t([4,!1])})).finally((function(){return L=!1}))):t([s,!1])}(n,u,d))},children:"Create Poll"})]}),Object(j.jsxs)("div",{className:"error-messages",children:[r[1]&&Object(j.jsx)("div",{className:"loading-spinner",style:{margin:"auto"}}),0!==r[0]&&Q(r[0])]})]})})},K=n(21),X="".concat(h,"/content/poll"),Z="".concat(h,"/content/poll/vote"),$=void 0;function ee(e){var t=e.options,n=["#d61609","#f5ed07","#39d10f","#0f4fd1"],c=0;t.forEach((function(e){return c+=e.votes})),c=Math.max(c,1);for(var s=0;s<t.length;++s)t[s].percentage=100*t[s].votes/c;var i=function(e,t){return{flexBasis:"".concat(e,"%"),backgroundColor:n[t%n.length],color:"white",display:"flex"}};return Object(j.jsx)("div",{className:"poll-graph",children:t.map((function(e,t){return Object(j.jsxs)("div",{className:"poll-graph-bar",children:[Object(j.jsx)("div",{style:i(e.percentage,t),children:Object(j.jsxs)("h5",{style:{textAlign:"center",alignSelf:"center",flexGrow:1},children:[Math.floor(e.percentage),"%"]})}),Object(j.jsx)("h5",{style:{textAlign:"center",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:e.txt})]},e.id)}))})}function te(){var e=window.location.href,t=document.createElement("input");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}var ne=function(){W=Object(l.g)().pollId;var e=Object(c.useState)(null),t=Object(a.a)(e,2),n=t[0],s=t[1],i=Object(l.f)();return Object(c.useEffect)((function(){return function(e,t){var n="".concat(X,"/").concat(e);fetch(n,{method:"GET",credentials:"include"}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(e){if(e.success)return-1!==e.userVoted&&($=e.userVoted),void t(e.poll);console.log(e)})).catch((function(e){console.log(e),alert("Failed to load poll")}))}(W,s)}),[]),console.log("Poll"),Object(j.jsx)("div",{className:"poll",children:Object(j.jsxs)("div",{className:"poll-box",children:[Object(j.jsxs)("div",{className:"box-title-bar",style:{flexBasis:"10%",flexGrow:1},children:[Object(j.jsx)("button",{onClick:function(){return i.push("/")},children:"Home"}),Object(j.jsx)("h1",{children:n&&n.name.length?n.name:"Loading"}),Object(j.jsx)("button",{onClick:te,children:"Share"})]}),Object(j.jsx)("div",{className:"poll-results",children:n&&Object(j.jsx)(ee,{options:n.options})}),Object(j.jsx)("div",{className:"poll-choices",children:n&&n.options.map((function(e){return Object(j.jsx)("button",{class:"poll-option-btn",disabled:$,onClick:function(){var t,c,i;t=e.id,c=n,i=s,fetch(Z,{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({pollId:W,voteId:t})}).then((function(e){if(200!==e.status)throw Error(e.status);return e.json()})).then((function(e){if(!e.success)throw Error(e.code);$=t;var n=Object(K.a)({},c);n.options[t].votes++,i(n)})).catch((function(e){console.log(e),alert("Failed to vote"),t=null}))},style:{backgroundColor:void 0!==$?e.id===$?"var(--bg-gradient-end)":"grey":""},children:e.txt},e.id)}))})]})})};var ce=function(){return Object(j.jsx)(r.a,{children:Object(j.jsx)("div",{className:"App",children:Object(j.jsxs)(l.c,{children:[Object(j.jsx)(l.a,{exact:!0,path:"/",children:Object(j.jsx)(G,{})}),Object(j.jsx)(l.a,{exact:!0,path:"/signup",children:Object(j.jsx)(g,{})}),Object(j.jsx)(l.a,{exact:!0,path:"/signin",children:Object(j.jsx)(m,{})}),Object(j.jsx)(l.a,{exact:!0,path:"/editprofile",children:Object(j.jsx)(D,{})}),Object(j.jsx)(l.a,{exact:!0,path:"/newpoll",children:Object(j.jsx)(Y,{})}),Object(j.jsx)(l.a,{path:"/poll/:pollId",children:Object(j.jsx)(ne,{})})]})})})},se=Object(w.a)({reducer:{userDetails:I}});o.a.render(Object(j.jsx)(s.a.StrictMode,{children:Object(j.jsx)(y.a,{store:se,children:Object(j.jsx)(ce,{})})}),document.getElementById("root"))}},[[33,1,2]]]);
//# sourceMappingURL=main.55655bff.chunk.js.map