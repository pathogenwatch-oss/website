# Macroreact

Ex-WGSA Front End.
Built on top of [Microreact](https://github.com/ImperialCollegeLondon/microreact).

## How to deploy

1. `git clone https://github.com/ImperialCollegeLondon/macroreact.git`
2. `cd macroreact`
3. `cp example.config.json config.json`
4. Edit `config.json`
5. `npm install`
6. `npm start`

## Q/A

### What results front end expects from middle end when uploading assemblies?
+ Per __assembly__:
  + `UPLOAD_OK`
  + `METADATA_OK`
  + `SCCMEC`
  + `PAARSNP_RESULT`
  + `MLST_RESULT`
  + `CORE_RESULT`
  + `FP_COMP`
+ Per __collection__:
  + `PHYLO_MATRIX`
  + `CORE_MUTANT_TREE`
  + `SUBMATRIX`

### How to get the latest back end?

1. Navigate to your local directory with JAR files.
2. `rsync -v -e "ssh -p 2222" ./*.jar wgst_admin@localhost:/nfs/wgst/jarchive/`
3. SSH to your VM: `ssh -p 2222 wgst_admin@localhost`
4. `sudo supervisorctl`
5. `restart all`
