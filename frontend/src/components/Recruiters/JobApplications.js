const JobApplications = (props) => {
    const appId = props.match.params.appId;
    return <p>{appId}</p>
};

export default JobApplications;