# Pathogenwatch

## Development
*NB Use Github instead of the GitLab instructions below*
1. Start MongoDB and Minio (cd ../deployment/dev; ./deploy.sh local)
2. Create a `config.json` (use ../deployment/dev/config.json and change urls to use localhost)
3. `export REPO_USER=YOUR_GITLAB_USER REPO_TOKEN=YOUR_TOKEN`
4. `git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/.insteadOf git://gitlab.com/ && git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps.insteadOf git@gitlab.com:cgps &&  git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps/.insteadOf https://gitlab.com/cgps/`
5. `npm install`
6. `npm run dev`
7. Start a worker `npm run runner`

## Scripts

**N.B. on JSON queries, Mongo objects such as ObjectId cannot be used, and the json versions (e.g. { "$oid": "123" }) may not work either. Luckily, Mongoose will cast string ids to ObjectId, so you can use { _id: "123" }**

### Running specific tasks

Use `node bin/submit/task.js`, example arguments:

* `--task='mlst'` task name as specified in tasks.json, required.
* `--query='{ "public": true }'` filters genomes to run, must be strict JSON format.

Genomes that are not eligible for the task will not be queued. If tasks are added to a "reprocessing" queue for running outside the user queues, they need a dedicated runner:

* `ssh` to a cgps-docker vm (swarm vms don't have enough resources to run tasks)
* Start a middle-end container as above and exec into it
* Start the runner:
```
node microservices/bootstrap.js runner --type='task' --queue='reprocessing' --workers=8 --precache
```
**N.B. Use `--precache` to add the results to the cache but _not_ to the genome record. This allows you to quickly update genome records from the cache after deploying a new version**

### Re-queuing genomes

Use `node bin/submit/genome.js`, example arguments:

* `--clean` removes obsolete results.
* `--query='{ "public": true }'` filters genomes to run, must be strict JSON format.
* `--queue='reprocessing'` queue name, defaults to 'reprocessing'

This adds a speciator task to the queue for each genome. Use a dedicated runner if using a "reprocessing" queue, with type "genome". Using `--precache` for genome runners will also avoid queuing tasks.

### Re-queuing collections

Use `node bin/submit/collection.js`, example arguments:

* `--query='{ "public": true }'` filters collections to run, must be strict JSON format.
