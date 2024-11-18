import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-create-blogs',
  templateUrl: './create-blogs.component.html',
  styleUrls: ['./create-blogs.component.scss']
})
export class CreateBlogsComponent implements OnInit {

  
  @Output() outputEvent = new EventEmitter<boolean>(false);

  formData: CanForm;

  ngOnInit() {
    this.formData = {
      type: 'create',
      discriminator: 'formConfig',
      columnPerRow: 1,
      sendAll:true,
      formFields: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title',
          required: {
            value: true,
            errorMessage: 'Title is required.'
          }
        },
        {
          name: 'bannedImage',
          type: 'image',
          placeholder: 'Upload Banner Image',
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
          placeholder: 'Description'
        }, 

        {
          name: 'body',
          type: 'array',
          placeholder: 'Blog',
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
              placeholder: 'SubTitle'
            },
            {
              name: 'description',
              type: 'textarea',
              placeholder: 'paragraph'
            }, 
            {
              name: 'images',
              type: 'image',
              placeholder: 'Upload Banner Image',
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
      submitApi: {
        apiPath: `/blogs`,
        method: 'POST'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Blogs created successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }

}
