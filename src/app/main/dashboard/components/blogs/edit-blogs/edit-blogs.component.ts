import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-edit-blogs',
  templateUrl: './edit-blogs.component.html',
  styleUrls: ['./edit-blogs.component.scss']
})
export class EditBlogsComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>(false);
  @Input() blogId: string;
  formData: CanForm;
  constructor() { }

  ngOnInit() {
    this.formData = {
      type: 'edit',
      discriminator: 'formConfig',
      columnPerRow: 1,
      formFields: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title',
          value: 'title',
          required: {
            value: true,
            errorMessage: 'Title is required.'
          }
        },
        {
          name: 'bannedImage',
          type: 'image',
          placeholder: 'Upload Banner Image',
          value: 'bannedImage',
          file: {
            api: {
              apiPath: '/files/upload',
              method: 'POST'
            },
            apiKey: 'files[0].path',
            // filePathKey: 'path',
            payloadName: 'files',
            acceptType: '.png, .jpg, .jpeg',
            // acceptType: '.csv, .pdf',
            limit: 1,
            multipleSelect: false,
          },
          // required: {
          //   value: true,
          //   errorMessage: 'Image is required.'
          // },
          suffixIcon: { name: 'attach_file' },
        },
 {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description',
          value: 'description'
        }, 

        {
          name: 'content',
          type: 'array',
          placeholder: 'Blog Content',
          value: 'content',
          formArray: {
            addButton: {
              type: 'raised',
              color: 'primary',
              label: 'Add'
            },
            deleteButton: {
              type: 'raised',
              color: 'primary',
              label: 'Delete'
            }
          },
          formFields: [    
            {
              name: 'title',
              type: 'text',
              placeholder: 'Sub Title',
              value: 'title'
            },
            {
              name: 'description',
              type: 'textarea',
              placeholder: 'Content',
              value: 'description'
            }, 
            {
              name: 'images',
              type: 'document',
              placeholder: 'Upload Banner Image',
              value: 'images',
              file: {
                api: {
                  apiPath: '/files/upload',
                  method: 'POST'
                },
                apiKey: 'files[0].path',
                payloadName: 'files',
                acceptType: '.png, .jpg, .jpeg',
                limit: 3,
                multipleSelect: true,
              },
              suffixIcon: { name: 'attach_file' },
            },
          ]
        },
        
      ],
      getApi:{
        apiPath: `/blogs/${this.blogId}`,
        method:'GET'
      },
      // apiDataKey:'data',
      submitApi: {
        apiPath: `/blogs/${this.blogId}`,
        method: 'PATCH'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Blog updated successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }

}
