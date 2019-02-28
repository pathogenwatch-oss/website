import './styles.css';

import React from 'react';

import { FormattedName } from '../../organisms';
import Fade from '../../components/fade';
import Badge from '../../components/badge';

import { ASSEMBLY_FILE_EXTENSIONS } from '../../app/constants';

export default ({ usage }) => (
  <section className="wgsa-page wgsa-compact-page wgsa-upload-instructions">
    {/* <header> */}
    <Fade className="pw-upload-assembler-usage">
      {usage && (
        <aside>
          <p>
            <strong>Processing reads is currently a trial service.</strong>
            <br />
            It is subject to a monthly limit per user and an overall monthly
            limit.
          </p>
          <p>
            You have <strong>{usage.remaining} assemblies</strong> remaining
            this month.
          </p>
          <p>
            <strong>
              {usage.usage.total} of {usage.limits.total} assemblies
            </strong>{' '}
            have been completed this month.
          </p>
        </aside>
      )}
    </Fade>
    <h1>Drag and drop files to begin.</h1>
    {/* </header> */}
    <div>
      <h2>Genomic Data</h2>
      <p>
        DNA sequences of whole genomes only. Please ensure that there are{' '}
        <strong>two paired-end reads</strong> files or{' '}
        <strong>one assembly</strong> file <strong>per genome</strong>.
        Metagenomic samples are not supported.
      </p>
      <h3>
        Reads <Badge color="#673c90">New</Badge>
      </h3>
      <p>
        One or more <strong>pairs of files</strong> in gzip-compressed{' '}
        <a
          href="https://en.wikipedia.org/wiki/FASTQ_format"
          target="_blank"
          rel="noopener"
        >
          FASTQ format
        </a>{' '}
        with one of the following extensions:
      </p>
      <table cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <td>_1.fastq.gz</td>
            <td>_2.fastq.gz</td>
          </tr>
          <tr>
            <td>.1.fastq.gz</td>
            <td>.2.fastq.gz</td>
          </tr>
          <tr>
            <td>_R1.fastq.gz</td>
            <td>_R2.fastq.gz</td>
          </tr>
          <tr>
            <td>.R1.fastq.gz</td>
            <td>.R2.fastq.gz</td>
          </tr>
        </tbody>
      </table>
      <h3>Assemblies</h3>
      <p>
        One or more files in{' '}
        <a
          href="https://en.wikipedia.org/wiki/FASTA_format"
          target="_blank"
          rel="noopener"
        >
          multi-FASTA format
        </a>{' '}
        with one of the following extensions:
      </p>
      <ul className="inline">
        {ASSEMBLY_FILE_EXTENSIONS.map(ext => (
          <li key={ext}>{ext}</li>
        ))}
      </ul>
    </div>
    <div>
      <h2>Metadata</h2>
      <p>
        One or more files in{' '}
        <a
          href="https://en.wikipedia.org/wiki/Comma-separated_values"
          target="_blank"
          rel="noopener"
        >
          CSV format
        </a>{' '}
        with the extension <strong>.csv</strong>.
      </p>
      <p>
        Files should contain a <strong>filename</strong> column to match each
        row to its respective genomic data:
      </p>
      <ul className="bulleted">
        <li>
          For <strong>assemblies</strong>, use the name of the file including
          extension.
        </li>
        <li>
          For <strong>reads</strong>, use either the common prefix (e.g. the
          lane ID or the strain name), or <strong>one of</strong> the names of
          the files including extension.
        </li>
      </ul>
      <p>
        To make full use of metadata, we strongly recommend including the
        following columns:
      </p>
      <ul className="inline">
        <li>latitude</li>
        <li>longitude</li>
        <li>year</li>
        <li>month</li>
        <li>day</li>
      </ul>
      <p>
        When providing a date, month and day are optional. Additional metadata
        may be included and will be saved.
      </p>
      <h3>CSV Templates</h3>
      <ul>
        <li>
          <a
            href="/pathogenwatch-metadata-template-reads.csv"
            download="pathogenwatch-metadata-template-reads.csv"
          >
            Reads
          </a>
        </li>
        <li>
          <a
            href="/pathogenwatch-metadata-template-assemblies.csv"
            download="pathogenwatch-metadata-template-assemblies.csv"
          >
            Assemblies
          </a>
        </li>
        <li>
          <a
            href="/pathogenwatch-metadata-template-typhi.csv"
            download="pathogenwatch-metadata-template-typhi.csv"
          >
            <FormattedName organismId="90370" />
          </a>
        </li>
      </ul>
    </div>
  </section>
);
