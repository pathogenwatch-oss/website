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

## Notes

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
