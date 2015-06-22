var LogData = React.createClass({
    loadData: function() {
    $.ajax({
        url: "/data/bank_data?view=byDate&limit=60&start=" + moment().format('YYYY-MM-DD'),
        dataType: 'json',
        success: function(data) {
            this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });
},
getInitialState: function() {
    return {data: []};
},
componentDidMount: function() {
    this.loadData();
},
componentDidUpdate: function() {
},
render: function() {
    var logItems = this.state.data.map(function(log) {
        return (
            <tr>
                <td>{log.date}</td>
                <td>{log.amount}</td>
                <td>{log.description}</td>
                <td>{log.source}</td>
                <td>{log.category}</td>
                <td>{log.transactionId}</td>
            </tr>
        )
    });
    return (
        <table class="table table-striped">
            <tbody>
            {logItems}
            </tbody>
        </table>
    );
}
});

React.render(<LogData/>, document.getElementById('logs'));
