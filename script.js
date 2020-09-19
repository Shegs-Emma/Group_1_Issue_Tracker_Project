jQuery(function() { 
    //This code will generate the random numbers for the id needed for deletion
    var GenRandom =  {

        Stored: [],
    
        Job: function(){
            var newId = Date.now().toString().substr(6); // or use any method that you want to achieve this string
    
            if( this.Check(newId) ){
                this.Job();
            }
    
            this.Stored.push(newId);
            return newId; // or store it in sql database or whatever you want
    
        },
    
        Check: function(id){
            for( var i = 0; i < this.Stored.length; i++ ){
                if( this.Stored[i] == id ) return true;
            }
            return false;
        }
    
    };


     // Issue Class Declaration
    class Issue{
        constructor(issueID, issueDesc, issueSeverity, assignedTo){
            this.issueID = issueID,
            this.issueDesc = issueDesc,
            this.issueSeverity = issueSeverity,
            this.assignedTo = assignedTo
        }
    };


     // Store Class: To Handle My storage
    class Store {
        static getIssues() {
            let issues;
            if(localStorage.getItem('issues') === null){
                issues = [];
            } else {
                issues = JSON.parse(localStorage.getItem('issues'));
            }
            return issues;
        };

        static addIssues(issue) {
            const issues = Store.getIssues();

            issues.push(issue);

            localStorage.setItem('issues', JSON.stringify(issues));
        };

        static modifyIssue(id, item, location) {
            const issues = Store.getIssues();

            issues.forEach((issue, index) => {
                if(issue.issueID == id && location === 1){
                   issue.issueDesc = item;
                } else if(issue.issueID == id && location === 2){
                    issue.issueSeverity = item;
                } else if(issue.issueID == id && location === 3){
                    issue.assignedTo = item;
                }
            });
            localStorage.setItem('issues', JSON.stringify(issues));
        };

        static deleteIssue($el){
            const issues = Store.getIssues();

            if($el.hasClass('delete')){
                let element = $el.parent().prev().prev().prev().prev().attr('id');
                issues.forEach((issue, index) => {
                    if(issue.issueID == element){
                        issues.splice(index, 1);
                    }
                });
                localStorage.setItem('issues', JSON.stringify(issues));
            }
        };
    };


    //UI Class Declaration
    class UI{
        static displayIssues(){
            const issues = Store.getIssues();

            issues.forEach((issue) => UI.addIssueToList(issue));
        }

        static addIssueToList(issue){
            let $tableBody = $('tbody');

            // Create the table row that will contain all my stuff
            let $myTableRow = $('<tr>');

            // Create checkbox element
            let $myCheckboxCol = $('<td>');
            $myCheckboxCol.html('<input type="checkbox" class="checker" />');

            // Create the description element
            let $myDescriptionCol = $('<td>');
            $myDescriptionCol.attr('id', issue.issueID);

            // Create the severity element
            let $mySeverityCol = $('<td>');

            // Create the Assignee element
            let $myAssigneeCol = $('<td>');

            
            $myDescriptionCol.text(issue.issueDesc);
            $mySeverityCol.text(issue.issueSeverity);
            $myAssigneeCol.text(issue.assignedTo);

            if(issue.issueSeverity === 'High'){
                $myTableRow.addClass('alert-danger');
            } else if(issue.issueSeverity === 'Medium'){
                $myTableRow.addClass('alert-warning')
            } else if(issue.issueSeverity === 'Low'){
                $myTableRow.addClass('alert-primary')
            }

            // Create the icons
            let $modifyBtn = $('<td>');
            $modifyBtn.html('<button type="button" class="btn btn-success mb-2 modify">Modify</button>');

            let $deleteBtn = $('<td>');
            $deleteBtn.html('<button type="button" class="btn btn-danger mb-2 delete">Delete</button>');
            
            // Attachment time!!
            $myTableRow.append($myCheckboxCol);
            $myTableRow.append($myDescriptionCol);
            $myTableRow.append($mySeverityCol);
            $myTableRow.append($myAssigneeCol);
            $myTableRow.append($modifyBtn);
            $myTableRow.append($deleteBtn);

            $tableBody.append($myTableRow);
        };


        static deleteIssue($el){
            if($el.hasClass('delete')){
                $el.parent().parent().remove();
                showAlert('Issue deleted successfully', 'danger');
            };
        };

        static checker($el){
            let $rowElement = $el.parent().parent();
            const $nativeClass = $rowElement.attr('class');
            let $sevRow = $el.parent().next().next().text();

            if($el.hasClass('checker')){
                if($nativeClass != 'alert-success'){
                    $rowElement.removeClass($nativeClass);
                    $rowElement.addClass('alert-success');
                } else if($sevRow === 'High'){
                    $rowElement.removeClass($nativeClass);
                    $rowElement.addClass('alert-danger');
                } else if($sevRow === 'Medium'){
                    $rowElement.removeClass($nativeClass);
                    $rowElement.addClass('alert-warning');
                } else if($sevRow === 'Low'){
                    $rowElement.removeClass($nativeClass);
                    $rowElement.addClass('alert-primary');
                }
                
            }
            
        }

        static modify($el){
            if($el.hasClass('modify')){
                let $issDes = $el.parent().prev().prev().prev().text();
                let $issSeve = $el.parent().prev().prev().text();
                let $assignTo = $el.parent().prev().text();
                let element = $el.parent().prev().prev().prev().attr('id');
                
                if($issDes || $issSeve || $assignTo){
                    var $descInputField = $(`<input type="text" class="modInput" value=${$issDes} />`);
                    var $severInputField = $(`
                    <select autocomplete="off" class="modSelect">
                        <option selected>${$issSeve}</option>
                        <option value="Low" class="text-primary">Low</option>
                        <option value="Medium" class="text-warning">Medium</option>
                        <option value="High" class="text-danger">High</option>
                    </select>
                    
                    `);
                    var $assignInputField = $(`
                    <select autocomplete="off" class="modSelect">
                        <option selected>${$assignTo}</option>
                        <option value="Emmanuel">Emmanuel</option>
                        <option value="Opeyemi">Opeyemi</option>
                        <option value="Kazeem">Kazeem</option>
                        <option value="Tubi">Tubi</option>
                    </select>
                    `);

                    $el.parent().prev().prev().prev().html($descInputField);
                    $el.parent().prev().prev().html($severInputField);
                    $el.parent().prev().html($assignInputField);

                    var $issueLocation = $el.parent().prev().prev().prev();
                    var $severityLocation = $el.parent().prev().prev();
                    var $assignee = $el.parent().prev();

                    // $descInputField.focus();

                    //Concerning the issue Description
                    myBlurer($descInputField, $issueLocation, element, 1);
                    keyMonitor($descInputField, $issueLocation, element, 1);

                    //Concerning the issue Severity
                    myBlurer($severInputField, $severityLocation, element, 2);
                    keyMonitor($severInputField, $severityLocation, element, 2);

                    //Concerning the asignee
                    myBlurer($assignInputField, $assignee, element, 3);
                    keyMonitor($assignInputField, $assignee, element, 3);
                }
            }

            function myBlurer($item, $method, id, index){
                $item.blur(function(){
                    $method.html($item.val());
                    Store.modifyIssue(id, $item.val(), index);
                });
            }

            function keyMonitor($item, $method, id, index){
                $item.keypress(function(e){
                    if(e.keyCode === 13){
                        $method.html($item.val());
                        Store.modifyIssue(id, $item.val(), index);
                    }
                });
            }
        }

        static clearField(){
            $('#describe-input').val('');
            $('#assign-input').val('Choose Assignee...');
            $('#inputGroupSelect03').val('Choose Severity...');
        }
    };


    // Event: Display Issues: THE VERY IGNITION OF THE CODE
    UI.displayIssues();


    // Event Add a Task
    $('#myForm').on('submit', (e) => {
        e.preventDefault();

        // Target the new task div
        let $myIssueDesc = $('#describe-input').val();
        let $myIssueAssign = $('#assign-input').val();
        let $issueSeverity = $('#inputGroupSelect03').val();
        let issueID = GenRandom.Job();

        // Validate the Input
        if($myIssueDesc === '' || $myIssueAssign === 'Choose Assignee...' || $issueSeverity === 'Choose Severity...'){
            showAlert('Please Fill in the Input', 'danger');
        } else {
            // Instatiate a Task
            const issue  = new Issue(issueID, $myIssueDesc, $issueSeverity, $myIssueAssign);

            // Add Task to the UI
            UI.addIssueToList(issue);

            // Add Task to Local storage
            Store.addIssues(issue);

            // Clear the UI
            UI.clearField();
        }
    });


    // Event Delete an Issue
    $('tbody').on('click', (e) => {
        // Remove Task from UI
        UI.deleteIssue($(e.target));

        // Remove Task from Storage
        Store.deleteIssue($(e.target));

        //The Open checker
        UI.checker($(e.target));

        //The Modify handler
        UI.modify($(e.target));
    });


    // The show alert function
    function showAlert(message, className){
        let $alertDiv = $('<div>');
        $alertDiv.addClass('alert alert-'+className);
        $alertDiv.append(document.createTextNode(message));

        let $myForm = $('#myForm');

        $myForm.prepend($alertDiv);

        // Disappear in 2 seconds
        setTimeout(() => $('.alert').remove(), 2000);
    };
});

