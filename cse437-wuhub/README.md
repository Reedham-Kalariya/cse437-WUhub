# WUHUB - Experience WUGO Reimagined

## Contributors
Stephanie Fisher, Reedham Kalariya, Leoul Mesfin (Leo) Gezu, Jeremy Stiava
Washington University in St. Louis, McKelvey School of Engineering

## Development Server
Navigate to [localhost:3000](http://localhost:3000/) in any web browser.
```
npm run dev
```

## Client-Side Rendering
```
// Import statements

// OPTIONAL: getServerSideProps() handles getting a specific "id" from the url, passing it to the Page.

const Page = () => {
  
  // Session Management
  
  // Declare Variables
  const [posts, setPosts] = useState();
  
  // Call(s) to API
    // e.g. get events with a pointer, get events without a point, get organizations the user is apart of
    // useEffect hooks should update on "user" state change
  
  // Handle Functions
  
  return (
    <>
      // Import header component and pass authentication
      <Header user={user} back={null} />
    
      {posts?.forEach((post) => {
          <p>{post.name}</p>
        }
      }
    </>
  )
  
}

export default Page;
```

## Graph Database Schema
### Nodes
- events
- organizations
- tags
- users

### Edges
- _memberships - users & organizations, by type: ("exec" or "member")
- _rsvps - users & events
- _hosts - events & organizations
- _tag_associations - tags & (events or organizations) as type
- _friendships - users & users

## REST API Endpoints (Still a work in progress) - http://localhost:3000/api/...

### /events, 
#### ```GET``` - No body required, returns all events in an array
```
[
  {Event},
  {Event},
  ...
]
```
#### ```POST``` - Body required, create a new event

### /events/[id]
#### ```GET``` - No body required, returns a single event
#### ```UPDATE``` - Body required, call to update a single event
#### ```DELETE``` - No body required, call to delete a single event

### /events/graph
#### ```POST``` - Finds all event nodes with "pointers"
```
// input
// Get a list of events where the host is the organization with the OID "ajksflkjsdgndsf"
[
  "to": "_hosts",
  "field": "oid",
  "value": "ajksflkjsdgndsf"
]
```

### /events/prompt
#### ```POST``` - Finds all event nodes WITHOUT a "pointer"
```
// input
// Get a list of events that the user has not rsvped to.
[
  "to": "_rsvps",
  "field": "uid",
  "value": "sdkjflsdfjklsdfj"
]
```
