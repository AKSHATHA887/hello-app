# Release Bot

An Azuze DevOps pipeline that creates PRs to promote code between branches. 


## Using Release Bot

include in your project with reference to this pipeline, and adjust the parameters accordingly

```yml
trigger: none

schedules:
- cron: '0 17 * * FRI'
  displayName: Friday 1700
  branches:
    include:
    - releases/0.1.x
  always: true
- cron: '0 13 * * FRI'
  displayName: Friday 1300
  branches:
    include:
    - develop
  always: true

resources:

  #if the project is not in accenture08 use this
  repositories:
    - repository: Azure-Pipelines-Template-AIR2731
      endpoint: CIO EA Cross Organization Access-REBAR_2731Git
      name: cio-common/BuildTemplates
      ref: master
      
  #if the project is in accenture08 use this
  repositories:
    - repository: Azure-Pipelines-Template-AIR2731
      type: git
      name: EnterpriseArchitecture_2641/Azure-Pipelines-Template-AIR2731
      ref: master

extends:
  template: templates/release-bot-pipelines/release-bot.yml@Azure-Pipelines-Template-AIR2731
  parameters:
    azure_devops_team_name: ''
    azure_devops_repository: ''
    azure_devops_organization: ''
    azure_devops_project: ''
    ${{ if eq(variables['Build.SourceBranchName'], 'develop') }}:
      source_branch: 'develop'
      target_branch: 'releases/0.1.x'
    ${{ if startsWith(variables['Build.SourceBranch'], 'refs/heads/releases/') }}:
      source_branch: 'releases/0.1.x'
      target_branch: 'main'
```

requires the following properties set:
```yml
# used to query for current iteration (e.g. "Application Architecture -  Engineering Delivery")
- name: 'azure_devops_team_name'
  type: string
  default: ''
# used for raising PRs against target repository (e.g. "2731REBAR_SPA_Schematics")
- name: 'azure_devops_repository'
  type: string
  default: ''
# used for raising PRs against target organization (e.g. "https://dev.azure.com/accenturecio08/")
- name: 'azure_devops_organization'
  type: string
  default: ''
# used for raising PRs against target PROJECT (e.g. "EnterpriseArchitecture_2641")
- name: 'azure_devops_project'
  type: string
  default: ''
# source for what is being promoted  (e.g. "develop")
- name: 'source_branch'
  type: string
  default: 'develop'
# used for destination branch.  PRs are raised into this branch (e.g. "main")
- name: 'target_branch'
  type: string
  default: 'releases/1.x'
# pass any required fields to create a UserStory, semicolon delimited
# e.g. scrum_stage found=Build;mytitle=val
- name: 'required_fields_for_process_template'
  type: string
  default: ''
```