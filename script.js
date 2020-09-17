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

        static deleteIssue($el){
            const issues = Store.getIssues();

            if($el.hasClass('delete')){
                let element = $el.parent().prev().prev().prev().prev().attr('id');
                console.log(element);
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

            // Validate the Input
            if(issue.issueDesc === '' || issue.issueSeverity === '' || issue.assignedTo === ''){
                showAlert('Please Fill the Input', 'danger');
            } else {
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

        // Instatiate a Task
        const issue  = new Issue(issueID, $myIssueDesc, $issueSeverity, $myIssueAssign);
        console.log(issue);

        // Add Task to the UI
        UI.addIssueToList(issue);

        // Add Task to Local storage
        Store.addIssues(issue);

        // Clear the UI
        UI.clearField();
    });


    // Event Delete an Issue
    $('tbody').on('click', (e) => {
        // Remove Task from UI
        UI.deleteIssue($(e.target));

        // Remove Task from Storage
        Store.deleteIssue($(e.target));

        //The Open checker
        UI.checker($(e.target));
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